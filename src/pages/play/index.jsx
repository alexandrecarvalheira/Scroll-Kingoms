import Image from "next/image";
import chest from "../../../public/images/airdrop.png";
import chest2 from "../../../public/images/airdrop2.png";
import { abi as MerkleABI } from "../../../types/ethers-contracts/MerkleABI";
import { Suspense } from "react";

import minimap from "../../../public/images/minimapv2.png";
import { useAccount, useNetwork } from "wagmi";
import playerStore, { contractStore } from "@/store/contractStore";
import { useEffect, useState } from "react";
import Mint from "@/components/mint";
import { HiLocationMarker } from "react-icons/hi";
import { motion } from "framer-motion";
import Link from "next/link";
import { ethers } from "ethers";
import Diamond from "@/contracts/data/diamond.json";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { generateProof } from "../../Utils/Merkle";
import AirdropModal from "@/components/airdropModal";
export default function Play() {
  const store = playerStore();
  const { address } = useAccount();
  const { chain } = useNetwork();
  const diamond = contractStore((state) => state.diamond);

  const [players, setPlayers] = useState([]);
  const [proof, setProof] = useState(null);
  useEffect(() => {
    const loadContract = async () => {
      setProof(await generateProof(address, diamond, 1));
      if (address) {
        const response = await diamond.getPlayers(address);
        const players = await response.map((val) => val.toNumber());
        store.setPlayers(await players);
        setPlayers(players);
      }
    };
    loadContract();
  }, [address, chain]);

  if (!address || (chain?.id !== 534353 && chain?.id !== 5001)) {
    return (
      <div className="relative min-h-[85vh] min-w-full flex flex-col items-center justify-center">
        <h2 className="font-bold text-white m-4">Connect to play</h2>
        <ConnectButton />
      </div>
    );
  }

  if (players.length === 0 && chain?.id === 5001) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="relative w-fit mb-auto min-h-fit flex flex-col items-center justify-center mx-auto  h-[78vh]"
      >
        {" "}
        {/* <div>
          <span className="inline-flex h-6 w-6 animate-spin rounded-full border-4 border-dotted border-purple-800"></span>
        </div> */}
        <Mint />
      </motion.div>
    );
  }
  if (players.length === 0 && chain?.id === 534353) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="relative w-fit mb-auto min-h-fit flex flex-col items-center justify-center mx-auto  h-[78vh]"
      >
        {" "}
        {/* <div>
          <span className="inline-flex h-6 w-6 animate-spin rounded-full border-4 border-dotted border-purple-800"></span>
        </div> */}
        <Mint />
      </motion.div>
    );
  }

  return (
    <>
      <Suspense>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="relative w-fit mb-auto min-h-fit flex flex-col sm:flex-row items-center justify-center mx-auto "
        >
          <Image
            src={minimap}
            alt="game map"
            width={1200}
            className="rounded-3xl shadow-inner "
          />
          <Link href={"/play/craft"}>
            <span
              className=" absolute right-[28%] top-[40%] w-[6%] hover:cursor-pointer animate-bounce tooltip"
              data-tip="craft"
            >
              <HiLocationMarker className="   w-full h-full  stroke-purple-800 stroke-1 fill-[#E6E6FA] mt-1 mx-auto" />
            </span>
          </Link>
          <Link href={"/play/train"}>
            <span
              className=" absolute right-[48%] top-[35%] w-[6%] hover:cursor-pointer animate-bounce tooltip"
              data-tip="training"
            >
              <HiLocationMarker className="   w-full h-full  stroke-purple-800 stroke-1 fill-[#E6E6FA] mt-1 mx-auto" />
            </span>
          </Link>
          <Link href={"/play/quest"}>
            <span
              className=" absolute right-[33%] top-[15%]  w-[6%]  hover:cursor-pointer animate-bounce tooltip"
              data-tip="quest"
            >
              <HiLocationMarker className="  w-full h-full stroke-purple-800 stroke-1 fill-[#E6E6FA] mt-1 mx-auto" />
            </span>
          </Link>
          <label
            htmlFor="airdrop"
            className=" absolute right-[5%] top-[80%] w-[10%]"
          >
            <Image
              src={!proof ? chest2 : chest}
              className="   hover:cursor-pointer dropdown"
              alt="chest"
            />
          </label>
          {proof && <AirdropModal proof={proof} />}

          <Link href={"/play/arena"}>
            <span
              className=" absolute right-[53%] top-[10%]  w-[6%]  hover:cursor-pointer animate-bounce tooltip"
              data-tip="arena"
            >
              <HiLocationMarker className="  w-full h-full stroke-purple-800 stroke-1 fill-[#E6E6FA] mt-1 mx-auto" />
            </span>
          </Link>
        </motion.div>
      </Suspense>
    </>
  );
}
