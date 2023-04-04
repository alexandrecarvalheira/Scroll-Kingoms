import createImg, { uploadToIPFS } from "@/Utils/image";
import { useForm, SubmitHandler } from "react-hook-form";
import contractStore from "@/store/contractStore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ethers } from "ethers";
import Diamond from "@/contracts/data/diamond.json";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Inputs = {
  name: string;
  gender: string;
};

type Player = {
  name?: string;
  gender?: boolean;
  image?: string;
};
export default function Mint() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    formState: { isSubmitting },
    register,
    handleSubmit,
    reset,
  } = useForm<Inputs>();
  const store = contractStore();

  async function handleImg() {
    const img = await createImg();
    console.log(img);
  }
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);
    reset();

    const provider = new ethers.providers.Web3Provider(window.ethereum as any);
    // Get signer
    const signer = provider.getSigner();
    const contract = await new ethers.Contract(
      process.env.NEXT_PUBLIC_DIAMOND_ADDRESS as string,
      Diamond.abi,
      signer
    );
    console.log(contract);
    const player: Player = {};
    try {
      const res = await fetch("/api/getimage");
      console.log(res);
      setIsLoading(false);

      const json = await res.json();
      console.log(json);

      let imgblob = await fetch(json.img);
      console.log(imgblob);
      let imgn = await imgblob.blob();
      console.log(imgn);
      let file = new File([imgn], "test.jpg", json.metadata);
      player.image = await uploadToIPFS(file);
      console.log(player.image);
      player.name = data.name;

      if (data.gender === "Male") {
        player.gender = true;
      } else {
        player.gender = false;
      }
      const mint = await contract.mint(
        player.name,
        player.image,
        player.gender
      );
      toast.promise(provider.waitForTransaction(mint.hash), {
        pending: "Tx pending: " + mint.hash,
        success: {
          render() {
            return "Success: " + mint.hash;
          },
        },
        error: "Tx failed",
      });

      setIsLoading(false);
    } catch (error: any) {
      reset();

      if (error.data) {
        toast.error(error.data.message as string, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else {
        toast.error(error.reason as string, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
      console.log(error);
      setIsLoading(false);
    }
  };
  return (
    <>
      <form
        className="flex flex-col mb-4 gap-2"
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
      >
        <input
          className="input bg-primary select-primary text-white"
          placeholder="Player Name"
          type="text"
          {...register("name", { required: true })}
        />
        <select
          className="input select-primary text-white bg-primary"
          {...register("gender", { required: true })}
        >
          <option>Male</option>
          <option>Female</option>
        </select>
        <button disabled={isLoading} className="btn btn-primary text-white">
          {" "}
          Mint Player
        </button>
      </form>
      {isLoading && (
        <div>
          <span className="relative inset-0 inline-flex h-6 w-6 animate-spin items-center justify-center rounded-full border-2 border-gray-300 after:absolute after:h-8 after:w-8 after:rounded-full after:border-2 after:border-y-indigo-500 after:border-x-transparent"></span>
        </div>
      )}
      <ToastContainer theme="dark" />
    </>
  );
}
