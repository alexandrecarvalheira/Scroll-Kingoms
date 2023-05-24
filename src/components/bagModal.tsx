import Image from "next/image";
import playerStore, { contractStore } from "@/store/contractStore";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import TreasureCard from "./treasureCard";

export default function BagModal() {
  const { address } = useAccount();
  const [itens, setItens] = useState([]);
  const player = playerStore((state) => state.player);
  const selectedPlayer = playerStore((state) => state.selectedPlayer);

  const diamond = contractStore((state) => state.diamond);
  const itemsPerPage = 10;

  useEffect(() => {
    const loadContract = async () => {
      const response = await diamond?.getTreasures(selectedPlayer);
      const itensarr = await response?.map((val: any) => val.toNumber());
      setItens((await itensarr) as any);
    };
    loadContract();
  }, [address, player]);

  return (
    <>
      <input type="checkbox" id="bag" className="modal-toggle" />
      <div className="modal bg-red">
        <div className="w-fit max-w-full bg-[#e6e6fa]  relative card p-2 card-side overflow-visible">
          <div className=" w-fit m-2 flex flex-col items-center">
            <div className="flex items-center">
              <label
                htmlFor="bag"
                className="btn btn-sm btn-circle absolute right-2 "
              >
                ✕
              </label>
            </div>

            <div className=" grid px-6 py-5 grid-cols-4 gap-4 w-fit h-full ">
              {itens.length != 0 &&
                itens.map((itemId) => (
                  <TreasureCard itemId={itemId} key={itemId} />
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
