import Diamond from "@/contracts/data/diamond.json";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import Image from "next/image";
import bodyarmor from "../../public/images/bodyarmor.jpeg";
import dragonscale from "../../public/images/dragonscale.png";
import KyberShard from "../../public/images/KyberShard.png";

import sword from "../../public/images/sword.jpeg";
import playerStore, { contractStore } from "@/store/contractStore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TreasureStructOutput } from "../../types/ethers-contracts/DIAMOND1HARDHAT";

export default function TreasureCard({ itemId }: any) {
  const [item, setItem] = useState<TreasureStructOutput | undefined>();
  const player = playerStore((state) => state.player);
  const selectedPlayer = playerStore((state) => state.selectedPlayer);
  const diamond = contractStore((state) => state.diamond);

  useEffect(() => {
    const loadContract = async () => {
      const response = await diamond?.getTreasure(itemId);
      setItem(await response);
    };
    loadContract();
  }, []);
  if (!item) return null;

  return (
    <div
      className={`overflow-visible dropdown w-12 h-12 rounded-md ring-2 bg-gray-100  items-center gap-2 tooltip`}
      data-tip={item?.name}
    >
      {item?.name === "Dscale" && (
        <label tabIndex={itemId}>
          <Image src={dragonscale} className="rounded-md " alt={item?.name} />
        </label>
      )}
      {item?.name === "KyberShard" && (
        <label tabIndex={itemId}>
          <Image src={KyberShard} className="rounded-md " alt={item?.name} />
        </label>
      )}
    </div>
  );
}
