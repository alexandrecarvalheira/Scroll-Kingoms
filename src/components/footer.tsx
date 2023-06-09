import { FaDiscord, FaTwitter } from "react-icons/fa";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className=" relative items-center footer flex justify-center w-full p-4 text-neutral-content ">
      <div className="items-center grid-flow-col">
        <p> Omni Kingdoms Copyright © 2023 - All right reserved</p>
      </div>
      <div className="grid-flow-col flex gap-4 md:place-self-center md:justify-self-end">
        <Link href={"https://twitter.com/OmniKingdoms"} target={"_blank"}>
          <FaTwitter size={30} color="#2aa9e0" />
        </Link>
        <Link href={"https://discord.com/invite/NX3qZuAFvG"} target={"_blank"}>
          <FaDiscord size={30} color="#5865f2" />
        </Link>
      </div>
    </footer>
  );
}
