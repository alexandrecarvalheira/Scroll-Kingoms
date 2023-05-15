import { ethers } from "ethers";
import playerStore, { contractStore } from "@/store/contractStore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import Countdown from "react-countdown";

export default function DragonModal() {
  const player = playerStore((state) => state.player);
  const selectedPlayer = playerStore((state) => state.selectedPlayer);
  const diamond = contractStore((state) => state.diamond);

  const [beginTimerDrag, setBeginTimer] = useState(false);
  const [hatEquiped, setHatEquiped] = useState(false);
  const [countdownDrag, setCountdown] = useState(0);

  async function CooldownTimer() {
    const blockTimestamp = (await diamond?.getCooldown(selectedPlayer)) as any;
    const startTime = blockTimestamp.toNumber() as any;
    const currentTimeStamp = (await diamond?.getBlocktime()) as any;
    const curTime = currentTimeStamp.toNumber() as any;
    const time = curTime - startTime;
    if (time < 43200) {
      setCountdown(43200 - time);
      setBeginTimer(true);
    }
  }
  useEffect(() => {
    CooldownTimer();

    if (player?.slot) {
      if (player?.slot.head.toNumber() !== 0) {
        setHatEquiped(true);
      }
    }
    if (!player?.status) {
      setBeginTimer(false);
    } else {
      if (player.status.toNumber() === 5) {
        setBeginTimer(true);
      }
    }
  }, [player?.status]);

  async function handleDragonQuest() {
    try {
      const quest = await diamond?.dragonQuest(selectedPlayer);
      toast.promise(quest!.wait(), {
        pending: "Tx pending: " + quest?.hash,
        success: {
          render({ data }) {
            console.log(data);
            setBeginTimer(true);
            if (data?.events![0]) {
              return "Success: You won the fight";
            } else {
              return "Failed: You lost the fight";
            }
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
  }
  return (
    <>
      <input type="checkbox" id="dragon-quest" className="modal-toggle" />
      <label htmlFor="dragon-quest" className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          <h3 className="text-lg font-bold text-center mb-2 text-purple-900">
            Fight the Dragon !
          </h3>
          {!hatEquiped && (
            <p className=" text-center text-xs italic">
              *needs wizard hat equiped
            </p>
          )}
          <div className="flex flex-col w-full lg:flex-row">
            <button
              className="btn grid flex-grow h-12 card  rounded-box place-items-center bg-[#9696ea] btn-accent "
              onClick={handleDragonQuest}
              disabled={beginTimerDrag || !hatEquiped}
            >
              {beginTimerDrag ? (
                <Countdown
                  date={Date.now() + 1000 * countdownDrag} // 1sec * seconds
                  onComplete={() => {
                    setBeginTimer(false);
                  }}
                  renderer={(props) => (
                    <>
                      {props.hours}:{props.minutes}:{props.seconds}
                    </>
                  )}
                />
              ) : (
                "Dragon Quest"
              )}
            </button>
          </div>
        </label>
        <ToastContainer theme="dark" />
      </label>
    </>
  );
}
