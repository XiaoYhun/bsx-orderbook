import Background from "./Background";
import Wrapper from "./Wrapper";
import Image from "next/image";

export default function Home() {
  return (
    <div className="w-full flex justify-center items-center h-svh flex-col gap-4 relative">
      {/* <Background /> */}
      <Image src="https://app.bsx.exchange/assets/logo-nav-full.svg" width={120} height={40} alt="logo" />
      <Wrapper />
    </div>
  );
}
