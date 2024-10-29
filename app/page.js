"use client";
import Image from "next/image";
import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Flip } from "gsap/all";
import gsap from "gsap";
import { card } from "@/components/constants/card";
import AdBanner from "@/components/Ads/AdBanner";

export default function Home() {
  const [targetCard, settargetCard] = useState([]);
  const [mePlayer, setmePlayer] = useState([]);
  const [otherPlayer, setotherPlayer] = useState([]);
  const [leftCard, setleftCard] = useState([]);
  const [preSelectedCard, setpreSelectedCard] = useState([]);
  const fistAllCardRender = useRef({
    mePlayer: [],
    leftCard: [],
    otherPlayer: [],
    targetCard: [],
  });
  const gameStart = useRef(false);
  const [startGame, setstartGame] = useState(false);

  const CardDropSoundRef = useRef(new Audio('/card-sounds-35956.mp3'));
  const DistributeCard = useRef(new Audio('/riffle-card-shuffle-104313.mp3'));

  function getTenRandomCard(card, n, setState, state) {
    let d = card
      .sort(() => 0.5 - Math.random())
      .slice(0, n)
      .sort((a, b) => a.number - b.number);
    console.log(fistAllCardRender.current);
    fistAllCardRender.current = {
      ...fistAllCardRender.current,
      [state]: d,
    };
    setState(d);
    let left = card.filter((e) => !d.includes(e));

    // setallCard(left)
    return left;
  }
  console.log(fistAllCardRender.current);
  async function getCard() {
    let leftCard = await getTenRandomCard(card, 10, setmePlayer, "mePlayer");
    console.log("length", leftCard?.length);
    let leftall = await getTenRandomCard(
      leftCard,
      10,
      setotherPlayer,
      "otherPlayer"
    );
    // console.log("length-2", leftallcard?.length)

    let getOneCard = leftall.sort(() => 0.5 - Math.random()).slice(0, 1);
    let leftallCards = leftall.filter((e) => e.id != getOneCard[0]?.id);
    // console.log("getOneCard",getOneCard)
    settargetCard(getOneCard);
    fistAllCardRender.current = {
      ...fistAllCardRender.current,
      leftCard: leftallCards,
      targetCard: getOneCard,
    };
    // setallCard(leftallCards)
    setleftCard(leftallCards);
  }

  useLayoutEffect(() => {
    getCard();
  }, []);

  const shuffleArray = (array) => {
    let shuffled = [...array];
    console.log(shuffled.length, "shuffled.length");
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const shuffleCards = () => {
    // Capture the initial state of the cards
    const container = document.getElementById("myUserCard");
    const state = Flip.getState(container.children);

    // Shuffle the card order
    // Get the card elements into an array and shuffle them
    const cards = Array.from(container.children);
    const shuffledCards = shuffleArray(cards);

    // Clear the container and re-append the shuffled elements
    container.innerHTML = ""; // Clear the container
    shuffledCards.forEach((card) => container.appendChild(card)); // Append shuffled cards

    // Animate the shuffle transition
    Flip.from(state, {
      duration: 1,
      ease: "power2.inOut",
      stagger: 0.05, // Add a slight delay between card flips
    });
  };

  const CardDropSoundRefplayAudio = () => {
    CardDropSoundRef.current.play().catch(error => {
      console.error("Error playing audio:", error);
    });
  };

  const DistributeCardplayAudio = () => {
    DistributeCard.current.play().catch(error => {
      console.error("Error playing audio:", error);
    });
  };

  const DistributeCardstopAudio = () => {
    DistributeCard.current.pause();
    DistributeCard.current.currentTime = 0; // Reset to the beginning
  };

  useEffect(() => {
    gsap.registerPlugin(Flip);

    const moveButton = document.getElementById("startGame");

    moveButton.addEventListener("click", () => {
      if (gameStart.current) {
        return;
      }
      DistributeCardplayAudio()
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
          rotateY: 180,
          stagger: 0.1,
          onComplete: () => {
            DistributeCardstopAudio()
          }
        });
      }
    });

    moveButton.addEventListener("click", async () => {
      if (gameStart.current) {
        return;
      }

      const containerB = document.getElementById("target2");
      // Get the state of elements, but only if they exist in the DOM
      const state = document.querySelectorAll(".targetCard").length
        ? Flip.getState(".targetCard", { props: "src" })
        : null;

      // Append all `.targetCard` elements to `containerB`
      const cards = document.querySelector(".targetCard");
      // cards.forEach((card) => {
      let id = cards.getAttribute("id");
      console.log(id, "id");
      const findCards = await findCard(id);
      console.log(findCards, "bb");
      containerB.appendChild(cards);
      // });

      if (state) {
        Flip.from(state, {
          duration: 1.5,
          ease: "power2.inOut",
          // rotateY: 360,
          stagger: 0.1,
          onComplete: () => {
            cards.setAttribute("src", findCards.url);
            gameStart.current = true;
            setstartGame(true);
          },
        });
      }
    });

    moveButton.addEventListener("click", () => {
      if (gameStart.current) {
        return;
      }
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
        gsap.to(card, { rotationY: 180 });
        leftDiv.appendChild(card);
      });

      // Animate transitions if states were captured
      if (statemycard) {
        Flip.from(statemycard, {
          duration: 0.6,
          ease: "power2.inOut",
          // rotateY: 180,
          stagger: 0.1,
          onComplete: () => {
            console.log("comming", statemycard);

            statemycard.targets.map((card) => {
              gsap.to(card, {
                rotate: 180,
                duration: 0.6,
                onComplete: () => {
                  // Remove all transformations or specific properties
                  card.style.transform = ""; // Clear transform style
                },
              });

              // Remove the src attribute if it's an <img> tag
              const id = card.getAttribute("id");

              const findCardInfo = findCard(id);
              card.setAttribute("src", findCardInfo.url);
            });
          },
        });
      }

      if (stateleftCard) {
        Flip.from(stateleftCard, {
          duration: 0.6,
          ease: "power2.inOut",
          // stagger: 0.1,
        });
      }
    });
  }, []);

  function getRandomItems(array, count = 10) {
    return array
      .sort(() => Math.random() - 0.5) // Shuffle the array
      .slice(0, count); // Select the first 'count' items
  }

  const dropCard = (id) => {
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
        ease: "sine.inOut",
        onStart: () => {
          CardDropSoundRefplayAudio();
        },
        onComplete: () => {
          cards.classList.remove("mycard");
        },
      });
    }
  };

  function findCard(event) {
    let id = event?.target
      ? event.target.id.split("-")[1]
      : event.split("-")[1];
    let find = card.filter((e) => e.id == id)?.[0];
    return find;
  }

  const pickCard = (event) => {
    // console.log(trigger)
    const containerB = document.getElementById("myUserCard");
    // Get the state of elements, but only if they exist in the DOM
    const state = Flip.getState(`#card-${event.id}`);

    // Append all `.card` elements to `containerB`
    const cards = document.querySelector(`#card-${event.id}`);

    const mycard = document.querySelectorAll(".mycard");

    for (let i = 0; i < mycard.length; i++) {
      let num = parseInt(mycard[i].getAttribute("data-page"));
      if (num > event.number) {
        const parent = mycard[i].parentNode;
        parent.insertBefore(cards, mycard[i]);
        break;
      }

      if (i == mycard.length - 1) {
        containerB.appendChild(cards);
      }
    }
    if (mycard.length == 0) {
      containerB.appendChild(cards);
    }

    if (state) {
      Flip.from(state, {
        absolute: true,
        duration: 0.6,
        ease: "sine.inOut",
        onStart: () => {
          CardDropSoundRefplayAudio();
          cards.classList.remove("leftCard");
          cards.classList.add("mycard");
          cards.setAttribute("src", event.url);
        },
      });
    }
  };

  const deadWood = useMemo(() => {
    let point = mePlayer.reduce((prev, total) => {
      return (prev += total.number);
    }, 0);
    return { point, card: mePlayer };
  }, [mePlayer]);

  const mieldCard = useMemo(() => {
    return shuffleArray(mePlayer).slice(0, 3);
  }, [mePlayer]);

  const cardClick = async (event) => {
    let list = event.target.classList.value;
    // console.log(event)
    if (list.includes("mycard")) {
      let id = event.target.id;
      let findCards = await findCard(event);
      setmePlayer((e) => {
        return e.filter((e) => e.id != findCards.id);
      });
      dropCard(id);
    } else if (list.includes("leftCard")) {
      let findCards = await findCard(event);
      setleftCard((e) => {
        return e.filter((e) => e.id != findCards.id);
      });
      setmePlayer((e) => {
        return [...e, findCards]
          .filter((e) => e)
          .sort((a, b) => a.number - b.number);
      });
      pickCard(findCards);
    }
  };

  return (
    <div className="flex bg-[url(https://www.gin-rummy-online.com/game/assets/images/backgrounds/1920x1200/green_felt.jpg)]">
      <AdBanner
        dataAdFormat={"auto"}
        dataFullWidthResponsive={'true'}
        dataAdSlot={"3970937194"}
      />
      <div className="flex flex-col h-dvh items-center justify-around p-5 w-[80%]">
        <div
          className="flex justify-center items-start h-60"
          id="otherUserCard"
        ></div>
        <button onClick={shuffleCards}>shffel</button>

        <div className="flex justify-between items-center w-full md:w-2/3 p-5 h-36 md:h-60">
          <div
            className="h-20 md:h-60 w-full flex justify-center items-center relative"
            id="leftDiv"
          ></div>
          <div
            className={`h-20 flex justify-center relative centerDiv w-96 md:w-80 transition-all`}
            id="startGame"
          >
            {fistAllCardRender.current.leftCard.map((e, i) => (
              <img
                alt="image"
                key={i}
                src={
                  //  e.url ||
                  "https://www.gin-rummy-online.com/game/assets/images/backs/146x198/rhombus_blue.png"
                }
                // style={{ marginLeft: `${(i*2)}px`}}
                id={`card-${e.id}`}
                data-page={e.number}
                // onClick={(event) => pickCard(e, event)}
                onClick={(e) => cardClick(e)}
                className={`w-14 h-24 md:w-32 md:h-44 cursor-pointer  leftCard`}
              />
            ))}

            {fistAllCardRender.current.targetCard.map((e, i) => (
              <img
                alt="image"
                key={i}
                src={
                  "https://www.gin-rummy-online.com/game/assets/images/backs/146x198/rhombus_blue.png"
                }
                id={`card-${e.id}`}
                data-page={e.number}
                className="w-14 h-24 md:w-32 md:h-44 cursor-pointer targetCard"
                // onClick={() => dropCard(`card-${e.id}`)}
                onClick={(e) => cardClick(e)}
              />
            ))}

            {fistAllCardRender.current.mePlayer.map((e, i) => (
              <img
                alt="image"
                key={i}
                // src={e.url}
                src={
                  //  e.url ||
                  "https://www.gin-rummy-online.com/game/assets/images/backs/146x198/rhombus_blue.png"
                }
                id={`card-${e.id}`}
                data-page={e.number}
                className="w-14 h-24 md:w-32 md:h-44 cursor-pointer mycard"
                // onClick={() => dropCard(`card-${e.id}`)}
                onClick={(e) => cardClick(e)}
              />
            ))}

            {fistAllCardRender.current.otherPlayer.map((e, i) => (
              <img
                alt="image"
                key={i}
                src={
                  "https://www.gin-rummy-online.com/game/assets/images/backs/146x198/rhombus_blue.png"
                }
                className="w-14 h-24 md:w-32 md:h-44 card"
              />
            ))}
          </div>
          <div
            className="h-36 md:h-60 w-full flex justify-center items-center relative"
            id="target2"
          >
            {startGame && (
              <div className="absolute -top-16 flex flex-col items-center">
                <img
                  src="https://www.gin-rummy-online.com/game/assets/images/players/pn103.png"
                  className="w-10 h-10 md:w-16 md:h-16"
                />
                <span className="text-sm text-white font-bold py-2">
                  Charlie (20)
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between md:justify-around w-full md:w-2/3 px-0 py-10 md:m-2 ">
          {startGame && (
            <div className="mield bg-black bg-opacity-40 p-2 rounded-md relative">
              <h1 className="text-white text-center capitalize font-semibold text-xs md:text-md pb-1.5">
                Mield
              </h1>
              <div className="flex image-container rounded-md">
                {mieldCard.slice(0, 3).map((e) => (
                  <img
                    src={e.url}
                    className="w-2 h-3 md:w-8 md:h-10 partial-image"
                  />
                ))}
              </div>

              {startGame && (
                <div className="absolute -bottom-28 flex flex-col items-center">
                  <img
                    src="https://ahoygamesdotcom.b-cdn.net/wp-content/uploads/2022/05/Icon_GinRummy_1024_rounded.png"
                    className="w-16 h-14"
                  />
                  <span className="text-sm text-white font-bold py-2">
                    You (20)
                  </span>
                </div>
              )}
            </div>
          )}

          {startGame && (
            <div className="deadwood bg-black bg-opacity-40 p-2 rounded-md">
              <h1 className="text-white text-center capitalize font-semibold text-xs md:text-md pb-1.5">
                Deadwood ({deadWood.point})
              </h1>
              <div className="flex image-container rounded-md transition-[width] duration-300 ease-in-out">
                {deadWood.card.map((e) => (
                  <img
                    src={e.url}
                    className="w-2 h-3 md:w-8 md:h-10 partial-image"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        <div
          className="flex justify-center items-end md:items-end h-24 md:h-60 transition-w"
          id="myUserCard"
        ></div>
      </div>

      <AdBanner
        dataAdFormat={"auto"}
        dataFullWidthResponsive={'true'}
        dataAdSlot={"2692189121"}
      />
    </div>
  );
}
