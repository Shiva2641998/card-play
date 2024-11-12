import { generateGameID } from "@/components/constants/generateGameID";
import Link from "next/link";
import React from "react";

function page() {
  const randomID = generateGameID()
  return (
    <div className="bg-black">
      <div className="fixed bg-black bg-opacity-50 w-screen h-screen top-0 left-0 z-10"></div>
      <video src="/pokerVideo.mp4" className="z-0 h-dvh" autoPlay loop muted />
      <div className="w-screen h-screen top-0 left-0 z-20 fixed p-20">
        <Link href={"/freeGame"}>
          <div className="lg:absolute top-20 left-20">
            <div className="w-60 h-full bg-black bg-opacity-40 text-white p-5 rounded-lg flex flex-col items-center shadow shadow-emerald-700 hover:bg-emerald-800 transition-all cursor-pointer hover:scale-110">
              <img
                src="https://freerangestock.com/sample/33072/-4-aces.jpg"
                className="w-fit h-32 rounded-lg"
              />
              <p className="text-lg font-semibold italic pt-4">
                Free game with Bot
              </p>
            </div>
          </div>
        </Link>
        <Link href={`/rummy?id=${randomID}`}>
          <div className="lg:absolute my-10 lg:my-0 top-20 right-20">
            <div className="w-60 h-full bg-black bg-opacity-40 text-white p-5 rounded-lg flex flex-col items-center shadow shadow-emerald-700 hover:bg-emerald-800 transition-all cursor-pointer hover:scale-110">
              <img
                src="https://5.imimg.com/data5/SELLER/Default/2024/3/405528477/KE/GK/JJ/2044907/casino-poker-chips-token-coin.jpg"
                className="w-fit h-32 rounded-lg"
              />
              <p className="text-lg font-semibold italic pt-4">
                Play game with Coins
              </p>
            </div>
          </div>
        </Link>
        <Link href={`/rummy?id=${randomID}`}>
          <div className="lg:absolute bottom-20 left-20">
            <div className="w-60 h-full bg-black bg-opacity-40 text-white p-5 rounded-lg flex flex-col items-center shadow shadow-emerald-700 hover:bg-emerald-800 transition-all cursor-pointer hover:scale-110">
              <img
                src="https://market-resized.envatousercontent.com/previews/files/346725313/preview.jpg?w=590&h=590&cf_fit=crop&crop=top&format=auto&q=85&s=670ad4c0514d554ad359c7faff05c1cbc6dd8af69e4c797e96f3bdd7d66667f0"
                className="w-fit h-32 rounded-lg"
              />
              <p className="text-lg font-semibold italic pt-4">
                Play with Real Money
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default page;
