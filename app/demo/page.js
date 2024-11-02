"use client";
import { card } from "@/components/constants/card";
import gsap, { Flip } from "gsap/all";
import React, { useEffect, useState } from "react";

const cardBackImage =
  "https://www.gin-rummy-online.com/game/assets/images/backs/146x198/rhombus_blue.png";

function page() {
  const [leftCard, setLeftCard] = useState([]);

  useEffect(() => {
    gsap.registerPlugin(Flip); // Register GSAP Flip plugin
    setLeftCard(card.slice(0, 5)); // Initialize with first 5 cards
  }, []);

  const clickButton = () => {
    // Capture the layout state of the cards before the state change
    const flipState = Flip.getState(".leftCard");

    setLeftCard((prev) => {
      return [...prev, card[prev.length]]; // Add the next card
    });

    // Animate the transition after React has updated the DOM
    setTimeout(() => {
      Flip.from(flipState, {
        duration: 1,
        ease: "power2.inOut",
        stagger: 0.1, // Optional stagger effect
      });
    }, 0);
  };

  const cardClick = (e) => {
    // Add any click functionality for each card if needed
    console.log("Card clicked:", e.currentTarget);
  };
  
  return (
    <div className="flex items-center flex-col bg-slate-200 h-screen">
      <button
        onClick={clickButton}
        className="my-5 bg-emerald-400 text-white px-3 py-2 rounded-lg"
      >
        Cliend
      </button>

      <div className="flex items-center">
        {leftCard.map((e, i) => (
          <div
            id={`card-${e.id}`}
            key={`card-${e.id}`}
            data-page={e.number}
            onClick={(e) => cardClick(e)}
            className="leftCard w-14 h-24 md:w-32 md:h-44 z-10 bg-no-repeat bg-contain bg-center overflow-hidden"
            style={{ backgroundImage: `url(${e.url})` }}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default page;
