import { claimAirdrop } from "../Utils/Merkle";
import { abi as MerkleABI } from "../../types/ethers-contracts/MerkleABI";
import { ethers } from "ethers";
import { ToastContainer, toast } from "react-toastify";

import playerStore, { contractStore } from "@/store/contractStore";
import Image from "next/image";
import KyberShard from "../../public/images/KyberShard.png";

export default function AirdropModal({ proof }: any) {
  const diamond = contractStore((state) => state.diamond);
  const store = playerStore();
  console.log("proof", proof);
  const claim = async () => {
    try {
      const tx = await diamond!.claimTreasureDropKyberShard(
        1,
        proof,
        store.selectedPlayer
      );
      toast.promise(tx!.wait(), {
        pending: "Tx pending: " + tx?.hash,
        success: {
          render() {
            return "Success: " + tx?.hash;
          },
        },
        error: "Tx failed",
      });
    } catch (error: any) {
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
    }
  };
  return (
    <>
      <input type="checkbox" id="airdrop" className="modal-toggle" />
      <label htmlFor="airdrop" className="modal cursor-pointer">
        <label
          className="modal-box  relative flex flex-col items-center justify-between bg-[#e6e6fa] gap-4"
          htmlFor=""
        >
          <p>You are eligible to claim: </p>
          <div
            className={`overflow-visible dropdown w-12 h-12 rounded-md ring-2 bg-gray-100  items-center gap-2 tooltip tooltip-right`}
            data-tip="KyberShard"
          >
            <label>
              <Image
                src={KyberShard}
                className="rounded-md "
                alt="KyberShard"
              />
            </label>
          </div>
          <button className="text-lg font-bold  btn" onClick={claim}>
            Claim airdrop
          </button>
        </label>
      </label>
      <ToastContainer theme="dark" />
    </>
  );
}
