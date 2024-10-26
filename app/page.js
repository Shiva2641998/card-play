"use client";
import Image from "next/image";
import React, { useEffect } from "react";
import { Flip } from "gsap/all";
import gsap from "gsap";
import { card } from "@/components/constants/card";

export default function Home() {

  useEffect(() => {
    gsap.registerPlugin(Flip);

    const moveButton = document.getElementById("startGame");

    moveButton.addEventListener("click", () => {
      const containerB = document.getElementById("otherUserCard");
      // Get the state of elements, but only if they exist in the DOM
      const state = document.querySelectorAll(".card").length
        ? Flip.getState(".card")
        : null;

      // Append all `.card` elements to `containerB`
      const cards = document.querySelectorAll(".card");
      cards.forEach((card) => {
        containerB.appendChild(card);
      });

      if (state) {
        Flip.from(state, {
          duration: 0.6,
          ease: "power2.inOut",
          stagger: 0.1,
        });
      }
    });

    moveButton.addEventListener("click", () => {
      const containerA = document.getElementById("myUserCard");
      const leftDiv = document.getElementById("leftDiv");
      // Get the state of elements, but only if they exist in the DOM
      const statemycard = document.querySelectorAll(".mycard").length
        ? Flip.getState(".mycard")
        : null;

      const stateleftCard = document.querySelectorAll(".leftCard").length
        ? Flip.getState(".leftCard")
        : null;

      // Append all `.mycard` elements to `containerA`
      const mecards = document.querySelectorAll(".mycard");
      mecards.forEach((card) => {
        containerA.appendChild(card);
      });

      const leftCard = document.querySelectorAll(".leftCard");
      leftCard.forEach((card) => {
        leftDiv.appendChild(card);
      });

      // Animate transitions if states were captured
      if (statemycard) {
        Flip.from(statemycard, {
          duration: 0.6,
          ease: "power2.inOut",
          stagger: 0.1,
        });
      }

      if (stateleftCard) {
        Flip.from(stateleftCard, {
          duration: 2,
          ease: "power2.inOut",
          stagger: 0.1,
        });
      }
    });
  }, []);

  function getRandomItems(array, count = 10) {
    return array
      .sort(() => Math.random() - 0.5) // Shuffle the array
      .slice(0, count); // Select the first 'count' items
  }

  const pickCard = (id) => {
    const containerB = document.getElementById("target2");
    // Get the state of elements, but only if they exist in the DOM
    const state = Flip.getState(`#${id}`);

    // Append all `.card` elements to `containerB`
    const cards = document.querySelector(`#${id}`);
    // cards.forEach((card) => {
    containerB.appendChild(cards);
    // });

    if (state) {
      Flip.from(state, {
        absolute: true,
        duration: 0.6,
        ease: "expo.out",
      });
    }
  };

  return (
    <div className="flex flex-col h-screen items-center justify-between p-5 bg-[url(https://t4.ftcdn.net/jpg/06/87/21/91/360_F_687219162_XDD3L22Jn72GL4MxYfGShvAvDodsKwME.jpg)]">
      <div className="flex justify-center h-60" id="otherUserCard"></div>

      <div className="flex justify-between w-2/3 ">
        <div className="h-60 w-40 relative" id="leftDiv"></div>
        <div className="h-60 w-40 relative centerDiv" id="startGame">
          {getRandomItems(card, 10).map((e, i) => (
            <img
              alt="image"
              key={i}
              src={
                "https://m.media-amazon.com/images/I/81hSQ2pbEnL._AC_UF1000,1000_QL80_.jpg"
              }
              // style={{ marginLeft: `${(i*2)}px`}}
              className={`w-40 h-60 -ml-7 border-2 rounded-lg shadow-lg  shadow-black leftCard`}
            />
          ))}

          {getRandomItems(card, 10).map((e, i) => (
            <img
              alt="image"
              key={i}
              src={e}
              id={`card-${i}`}
              className="w-40 h-60 -ml-7 cursor-pointer hover:-mt-4 mycard"
              onClick={() => pickCard(`card-${i}`)}
            />
          ))}

          {getRandomItems(card, 10).map((e, i) => (
            <img
              alt="image"
              key={i}
              src={
                "https://m.media-amazon.com/images/I/81hSQ2pbEnL._AC_UF1000,1000_QL80_.jpg"
              }
              className="w-40 h-60 -ml-7 border-2 rounded-lg shadow-lg shadow-black card"
            />
          ))}
        </div>
        <div className="h-60 w-40" id="target2"></div>
      </div>

      <div className="flex justify-center h-60" id="myUserCard"></div>
    </div>
  );
}
