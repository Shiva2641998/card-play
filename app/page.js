"use client";
import Image from "next/image";
import React, {
  useCallback,
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
import { debounce, getRandomColor } from "@/components/constants";

const cardBackImage =
  "https://www.gin-rummy-online.com/game/assets/images/backs/146x198/rhombus_blue.png";

export default function Home() {
  const [targetCard, settargetCard] = useState([]);
  const [mePlayer, setmePlayer] = useState([]);
  const [otherPlayer, setotherPlayer] = useState([]);
  const [leftCard, setleftCard] = useState([]);
  const fistAllCardRender = useRef({
    mePlayer: [],
    leftCard: [],
    otherPlayer: [],
    targetCard: [],
  });
  const gameStart = useRef(false);
  const [startGame, setstartGame] = useState(false);

  const [myChance, setmyChance] = useState(true);
  const [canPick, setCanPick] = useState(false);
  const [endGame, setendGame] = useState(false);
  const [onlyTargetPick, setonlyTargetPick] = useState(true);

  const CardDropSoundRef = useRef();
  const DistributeCard = useRef();

  useEffect(() => {
    if (!myChance && !endGame) {
      setTimeout(() => {
        document.getElementById("otherPick").click();
      }, 1500);
      setTimeout(() => {
        document.getElementById("otherDrop").click();
      }, 3000);
    }
  }, [myChance]);

  const pickTimeout = () => {
    // Simulate picking a card
    if (!myChance && !endGame) {
      let pc = getRandomItems(leftCard, 1)?.[0];
      setleftCard((prevCards) => {
        return prevCards.filter((card) => card.id !== pc.id);
      });
      setotherPlayer((prevOtherPlayer) => {
        let d = [...prevOtherPlayer, pc];
        return d;
      });
      pickOtherCard(pc);
    }
  };

  const dropTimeout = () => {
    if (!myChance && !endGame) {
      let dc = getRandomItems(otherPlayer, 1)?.[0];
      // let d = otherPlayer.filter((card) => card.id !== dc.id);
      // setotherPlayer(d);
      setotherPlayer((prevOtherPlayer) => {
        let d = prevOtherPlayer.filter((card) => card.id !== dc.id);
        return d;
      });
      dropOtherCard(dc);
    }
  };

  function getTenRandomCard(card, n, setState, state) {
    let d = card
      .sort(() => 0.5 - Math.random())
      .slice(0, n)
      .sort((a, b) => a.number - b.number);
    fistAllCardRender.current = {
      ...fistAllCardRender.current,
      [state]: d,
    };
    setState(d);
    let left = card.filter((e) => !d.includes(e));

    // setallCard(left)
    return left;
  }

  async function getCard() {
    document.getElementById("leftDiv").innerHTML = "";
    document.getElementById("target").innerHTML = "";
    document.getElementById("myUserCard").innerHTML = "";
    fistAllCardRender.current = {
      mePlayer: [],
      leftCard: [],
      otherPlayer: [],
      targetCard: [],
    };
    setleftCard([]);
    setmePlayer([]);
    setotherPlayer([]);
    settargetCard([]);

    let leftCard = await getTenRandomCard(card, 10, setmePlayer, "mePlayer");
    let leftall = await getTenRandomCard(
      leftCard,
      10,
      setotherPlayer,
      "otherPlayer"
    );

    let getOneCard = leftall.sort(() => 0.5 - Math.random()).slice(0, 1);
    let leftallCards = leftall.filter((e) => e.id != getOneCard[0]?.id);
    settargetCard(getOneCard);
    fistAllCardRender.current = {
      ...fistAllCardRender.current,
      leftCard: leftallCards,
      targetCard: getOneCard,
    };
    // setallCard(leftallCards)
    settargetCard(getOneCard)
    setleftCard(leftallCards);
  }

  useLayoutEffect(() => {
    if (typeof window !== "undefined") {
      CardDropSoundRef.current = document.getElementById("cardDropSound");
      DistributeCard.current = document.getElementById("distributeCardSound");
    }
    getCard();
  }, []);

  const CardDropSoundRefplayAudio = () => {
    CardDropSoundRef.current?.play().catch((error) => {
      console.error("Error playing audio:", error);
    });
  };

  const DistributeCardplayAudio = () => {
    DistributeCard.current?.play().catch((error) => {
      console.error("Error playing audio:", error);
    });
  };

  const DistributeCardstopAudio = () => {
    DistributeCard.current?.pause();
    DistributeCard.current.currentTime = 0; // Reset to the beginning
  };

  const GimRummyStart = async () => {
    // DistributeCardplayAudio();
    // other Player Card
    const otherUserCardDiv = document.getElementById("otherUserCard");
    // Get the state of elements, but only if they exist in the DOM
    const otherUserCardstate = document.querySelectorAll(".card").length
      ? Flip.getState(".card")
      : null;

    // Append all `.card` elements to `containerB`
    const otherUserCardstates = document.querySelectorAll(".card");
    otherUserCardstates.forEach((card) => {
      otherUserCardDiv.appendChild(card);
    });

    if (otherUserCardstate) {
      Flip.from(otherUserCardstate, {
        duration: 0.6,
        ease: "power2.inOut",
        rotateY: 180,
        stagger: 0.1,
        onComplete: () => {
          DistributeCardstopAudio();
        },
      });
    }

    // target Card
    const targetcontainer = document.getElementById("target");
    // Get the state of elements, but only if they exist in the DOM
    const targetState = document.querySelectorAll(".targetCard").length
      ? Flip.getState(".targetCard", { props: "src" })
      : null;

    // Append all `.targetCard` elements to `containerB`
    const targetCards = document.querySelector(".targetCard");
    console.log("targetCards", targetCards, fistAllCardRender);
    // cards.forEach((card) => {
    let id = targetCards.getAttribute("id");
    const findCards = await findCard(id);
    targetcontainer.appendChild(targetCards);
    // });

    if (targetState) {
      Flip.from(targetState, {
        duration: 0.6,
        ease: "power2.inOut",
        // rotateY: 360,
        stagger: 0.1,
        onStart: () => {
          console.log(targetCards, " targetCards");
          // targetCards.querySelector("img").setAttribute("src", findCards.url);
          targetCards.style.backgroundImage = `url(${findCards.url})`;
          gameStart.current = true;
          setstartGame(true);
        },
      });
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
        onStart: () => {
          statemycard.targets.map((card) => {
            const id = card.getAttribute("id");

            const findCardInfo = findCard(id);
            // card.querySelector("img").setAttribute("src", findCardInfo.url);
            card.style.backgroundImage = `url(${findCardInfo.url})`;
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
  };

  useEffect(() => {
    gsap.registerPlugin(Flip);
    setTimeout(() => {
      GimRummyStart();
    }, 1000);
  }, []);

  function getRandomItems(array, count = 10) {
    return array.sort(() => Math.random() - 0.5).slice(0, count);
  }

  const pickOtherCard = (event) => {
    const containerB = document.getElementById("otherUserCard");
    // Get the state of elements, but only if they exist in the DOM
    const state = Flip.getState(`#card-${event.id}`);

    // Append all `.card` elements to `containerB`
    const cards = document.getElementById(`card-${event.id}`);

    containerB.appendChild(cards);

    Flip.from(state, {
      // absolute: true,
      duration: 0.6,
      // rotateY: 180,
      // rotationY: 90,
      ease: "sine.inOut",
      onStart: () => {
        // cards.setAttribute("src", event.url);
        CardDropSoundRefplayAudio();
        cards.classList.remove("leftCard");
        cards.classList.add("card");
      },
      onComplete: () => {},
    });
  };

  const dropOtherCard = async (event) => {
    console.log("event:::", event, "mmmm");

    const containerB = document.getElementById("target");
    // Get the state of elements, but only if they exist in the DOM
    const state = Flip.getState(`#card-${event.id}`);

    // Append all `.card` elements to `containerB`
    const cards = document.getElementById(`card-${event.id}`);

    containerB.appendChild(cards);

    Flip.from(state, {
      absolute: true,
      duration: 0.6,
      ease: "sine.inOut",
      onStart: () => {
        CardDropSoundRefplayAudio();
        cards.classList.add("targetCard");
        cards.classList.remove("card");
        // cards.querySelector("img").setAttribute("src", event.url);
        cards.style.backgroundImage = `url(${event.url})`;
        setmyChance(true);
      },
    });
  };

  const dropCard = (id) => {
    if(endGame) return
    const containerB = document.getElementById("target");
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
          cards.classList.remove("card");
          cards.classList.add("targetCard");
          setCanPick(false);
          setmyChance(false);
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
    if(endGame) return
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
          cards.classList.remove("targetCard");
          cards.classList.add("mycard");
          // cards.setAttribute("src", event.url);
          cards.style.backgroundImage = `url(${event.url})`;
        },
      });
    }
  };

  function hasThreeOccurrencesOfThree(arr, findNum) {
    // Count the number of occurrences of 3 in the array
    const count = arr.filter((num) => num.number === findNum).length;

    // Check if the count is exactly 3
    return count >= 3;
  }

  const meldsCardFound = useMemo(() => {
    // let point = mePlayer;
    let mc = [...mePlayer]
      .map((e) => (hasThreeOccurrencesOfThree(mePlayer, e.number) ? e : false))
      .filter((d) => d);

    console.log("mieldCard -", mc);
    return mc;
    // return { point, card: mePlayer };
  }, [mePlayer]);

  useEffect(() => {
    if (meldsCardFound?.length > 0) {
      shuffleCards(meldsCardFound);
    }
  }, [meldsCardFound]);

  const shuffleArray = (array, meldsCard) => {
    if (meldsCard?.length > 0) {
      let shuffled = [...array];
      let newArr = [];
      console.log(shuffled, "shuffled.length", meldsCard);
      let cardIds = meldsCard?.map((e) => `card-${e.id}`);
      var randomColor = getRandomColor();
      for (let i = 0; i < shuffled.length; i++) {
        console.log("cardIds", cardIds);
        if (cardIds.includes(shuffled[i].id)) {
          newArr.unshift(shuffled[i]);
          shuffled[i].classList.add("mieldCard");
          shuffled[i].style.setProperty("--random-color", randomColor);
          shuffled[i].classList.remove("mycard");
        } else {
          shuffled[i].classList?.remove("mieldCard");
          shuffled[i].classList?.add("mycard");
          randomColor = getRandomColor();
          newArr.push(shuffled[i]);
        }
        // const j = Math.floor(Math.random() * (i + 1));
        // [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return newArr;
    } else {
      return [];
    }
  };

  const shuffleCards = (meld) => {
    // Capture the initial state of the cards
    const container = document.getElementById("myUserCard");

    const state = Flip.getState(container.children);

    // Shuffle the card order
    // Get the card elements into an array and shuffle them
    const cards = Array.from(container.children);
    console.log("cards", cards);
    const shuffledCards = shuffleArray(
      cards.filter((e) => !e.className.includes("mieldCard")),
      meld
    );

    // Clear the container and re-append the shuffled elements
    container.innerHTML = ""; // Clear the container
    [
      ...cards.filter((e) => e.className.includes("mieldCard")),
      ...shuffledCards,
    ].forEach((card) => container.appendChild(card)); // Append shuffled cards

    // Animate the shuffle transition
    Flip.from(state, {
      duration: 1,
      ease: "power2.inOut",
      // stagger: 0.05, // Add a slight delay between card flips
    });
  };

  const deadWood = useMemo(() => {
    let filterIds =
      meldsCardFound?.length > 0 ? meldsCardFound.map((d) => d.id) : [];
    let newCard = mePlayer.filter((e) =>
      filterIds?.length > 0 ? !filterIds.includes(e.id) : e
    );
    console.log(newCard, "meldsCardFound", meldsCardFound, mePlayer);
    let point = newCard.reduce((prev, total) => {
      return (prev += total.number);
    }, 0);
    return { point, card: newCard };
  }, [mePlayer, meldsCardFound]);

  const deadWoodotherPlayer = useMemo(() => {
    let point = otherPlayer.reduce((prev, total) => {
      return (prev += total.number);
    }, 0);
    return { point, card: otherPlayer };
  }, [otherPlayer]);

  const mieldCard = useMemo(() => {
    return shuffleArray(mePlayer).slice(0, 3);
  }, [mePlayer]);

  const cardClick = debounce(async (event) => {
    if (!myChance) return;

    let list = event.target.classList.value;
    console.log(list, "list");
    if (list.includes("mycard")) {
      if (!canPick) return;
      let id = event.target.id;
      let findCards = await findCard(event);
      setmePlayer((e) => {
        return e.filter((e) => e.id != findCards.id);
      });
      dropCard(id);
    } else if (list.includes("leftCard")) {
      if (canPick) return;
      if (onlyTargetPick) return;
      setCanPick(true);
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
    } else if (list.includes("target")) {
      if (canPick) return;
      setCanPick(true);
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
      if (onlyTargetPick) setonlyTargetPick(false);
    }
  }, 200);

  const OtherUserCardClick = async (event) => {
    let list = event.target.classList.value;

    if (list.includes("card")) {
      let id = event.target.id;
      let findCards = await findCard(event);

      setotherPlayer((e) => {
        return e.filter((e) => e.id != findCards.id);
      });
      dropOtherCard(findCards);
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

  const GimRummyReverseCard = async () => {
    // DistributeCardplayAudio();
    // other Player Card
    const otherUserCardDiv = document.getElementById("startGame");
    // Get the state of elements, but only if they exist in the DOM
    const otherUserCardstate = document.querySelectorAll(".card").length
      ? Flip.getState(".card")
      : null;

    // Append all `.card` elements to `containerB`
    const otherUserCardstates = document.querySelectorAll(".card");
    otherUserCardstates.forEach((card) => {
      otherUserCardDiv.appendChild(card);
    });

    if (otherUserCardstate) {
      Flip.from(otherUserCardstate, {
        duration: 0.6,
        ease: "power2.inOut",
        rotateY: 180,
        stagger: 0.1,
        onComplete: () => {
          DistributeCardstopAudio();
          getCard();
          setendGame(false);
          setstartGame(false);
          setTimeout(() => {
            GimRummyStart();
          }, 1000);
        },
      });
    }

    // target Card
    const targetcontainer = document.getElementById("startGame");
    // Get the state of elements, but only if they exist in the DOM
    const targetState = document.querySelectorAll(".targetCard").length
      ? Flip.getState(".targetCard", { props: "src" })
      : null;

    // Append all `.targetCard` elements to `containerB`
    const targetCards = document.querySelectorAll(".targetCard");

    targetCards.forEach((card) => {
      targetcontainer.appendChild(card);
    });
    // cards.forEach((card) => {
    // targetcontainer.appendChild(targetCards);
    // });

    if (targetState) {
      Flip.from(targetState, {
        duration: 0.6,
        ease: "power2.inOut",
        // rotateY: 360,
        // stagger: 0.1,
        onStart: () => {
          console.log(targetCards, " targetCards");
          targetCards.forEach((card) => {
            card.style.backgroundImage = `url(${cardBackImage})`;
            card.classList.remove("targetCards")
            card.classList.add("leftCard");
          });
          // targetCards.querySelector("img").setAttribute("src", findCards.url);
          // targetCards.style.backgroundImage = `url(${cardBackImage})`;
          // gameStart.current = true;
          // setstartGame(true);
        },
      });
    }

    const containerA = document.getElementById("startGame");
    const leftDiv = document.getElementById("startGame");
    // Get the state of elements, but only if they exist in the DOM
    const statemycard = document.querySelectorAll(".mycard").length
      ? Flip.getState(".mycard")
      : null;

    const statemieldcard = document.querySelectorAll(".mieldCard").length
      ? Flip.getState(".mieldCard")
      : null;

    const stateleftCard = document.querySelectorAll(".leftCard").length
      ? Flip.getState(".leftCard")
      : null;

    // Append all `.mycard` elements to `containerA`
    const mieldCard = document.querySelectorAll(".mieldCard");
    mieldCard.forEach((card) => {
      containerA.appendChild(card);
    });

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
        onStart: () => {
          statemycard.targets.map((card) => {
            // card.querySelector("img").setAttribute("src", findCardInfo.url);
            card.style.backgroundImage = `url(${cardBackImage})`;
   
          });
        },
      });
    }

    // statemieldcard reverse
    if (statemieldcard) {
      Flip.from(statemieldcard, {
        duration: 0.6,
        ease: "power2.inOut",
        // rotateY: 180,
        stagger: 0.1,
        onStart: () => {
          statemieldcard.targets.map((card) => {
            // card.querySelector("img").setAttribute("src", findCardInfo.url);
            card.style.backgroundImage = `url(${cardBackImage})`;
            card.classList.remove("mieldCard");
            card.classList.add("mycard");
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
  };

  const startAgain = () => {
    setendGame(true);
    setTimeout(() => {
      GimRummyReverseCard();
      // getCard();
      // setendGame(false)
      // setstartGame(false)
      // GimRummyStart();
    }, 3000);
  };

  useEffect(() => {
    if (
      (deadWood.point <= 10 || deadWoodotherPlayer.point <= 10) &&
      startGame
    ) {
      startAgain();
    } else {
      setendGame(false);
    }
  }, [deadWood, deadWoodotherPlayer]);

  return (
    <div className="flex h-screen overflow-hidden bg-[url(https://www.gin-rummy-online.com/game/assets/images/backgrounds/1920x1200/green_felt.jpg)]">
      <button onClick={startAgain}>start Again</button>
      <audio id="cardDropSound" src="/card-sounds-35956.mp3" preload="auto" />
      <audio
        id="distributeCardSound"
        src="/riffle-card-shuffle-104313.mp3"
        preload="auto"
      />

      {endGame && (
        <div className="fixed top-0 left-0 h-screen w-screen flex justify-center items-center bg-black bg-opacity-80 text-white z-[100]">
          <div className="text-4xl mr-10 flex flex-col items-center">
            <span>You</span>
            <span>{deadWood.point}</span>
          </div>
          <div className="text-4xl flex flex-col items-center">
            <span className="text-sm">VS</span>
            <span>-</span>
          </div>
          <div className="text-4xl ml-10 flex flex-col items-center">
            <span>Charlie</span>
            <span>{deadWoodotherPlayer.point} </span>
          </div>
          <div className="text-4xl ml-10 flex flex-col items-center">
            <span></span>
            <span>
              {" "}
              = {Math.abs(deadWoodotherPlayer.point - deadWood.point)}
            </span>
          </div>
        </div>
      )}

      {!startGame && (
        <div className="bg-black bg-opacity-70 w-screen h-screen fixed top-0 left-0 z-[10000]">
          <div className="flex justify-center items-center h-screen flex-col">
            <h1 className="text-2xl  font-bold text-white">
              Game will start soon!!
            </h1>
            <img
              src="https://www.cardgame.com/uploaded/game/screenshot/gin-rummy-classic.webp"
              className="w-96 h-60 rounded-md mt-2"
            />
          </div>
        </div>
      )}

      <AdBanner
        dataAdFormat={"auto"}
        dataFullWidthResponsive={"true"}
        dataAdSlot={"3970937194"}
      />

      <div className="flex flex-col h-dvh items-center justify-around p-1.5 w-[80%]">
        <div className="flex justify-around w-full items-center">
          <button className="hidden" onClick={pickTimeout} id="otherPick">
            Other pick
          </button>
          <div
            className="flex justify-center items-start h-40"
            id="otherUserCard"
          ></div>
          <button className="hidden" onClick={dropTimeout} id="otherDrop">
            Other drop
          </button>
        </div>

        <div className="flex justify-between md:justify-around w-full md:w-2/3 px-0 md:m-2 py-3">
          <div></div>
          {endGame ? (
            <div className="deadwood bg-black bg-opacity-40 p-2 rounded-md">
              <h1 className="text-white text-center capitalize font-semibold text-xs md:text-md pb-1.5">
                Deadwood ({deadWoodotherPlayer?.point})
              </h1>
            </div>
          ) : (
            <div className="w-full justify-end flex mr-20">
              <div className="flex flex-col items-center justify-end ">
                <img
                  src="https://www.gin-rummy-online.com/game/assets/images/players/pn103.png"
                  className="w-10 h-10 md:w-16 md:h-16"
                />
                <span className="text-sm text-white font-bold py-2">
                  Charlie ({deadWoodotherPlayer?.point})
                </span>
              </div>
            </div>
          )}
        </div>

        {/* <button onClick={shuffleCards}>shffel</button> */}

        <div className="flex justify-between items-center w-full md:w-2/3 h-36 md:h-60">
          <div
            className="h-20 md:h-60 w-full flex justify-center items-center relative"
            id="leftDiv"
          ></div>

          <div
            className={`h-20 flex justify-center relative centerDiv w-96 md:w-80 transition-all`}
            id="startGame"
          >
            {leftCard?.length > 0 && 
              fistAllCardRender.current.leftCard.map((e, i) => (
                <div
                  id={`card-${e.id}`}
                  key={`card-${e.id}`}
                  data-page={e.number}
                  onClick={(e) => cardClick(e)}
                  className="leftCard w-14 h-24 md:w-32 md:h-44 z-10 bg-no-repeat bg-contain bg-center overflow-hidden"
                  style={{ backgroundImage: `url(${cardBackImage})` }}
                ></div>
              ))}

            {targetCard?.length > 0 &&
              fistAllCardRender.current.targetCard.map((e, i) => (
                <div
                  id={`card-${e.id}`}
                  key={`card-${e.id}`}
                  data-page={e.number}
                  onClick={(e) => cardClick(e)}
                  className="targetCard w-14 h-24 md:w-32 md:h-44 z-10 bg-no-repeat bg-contain bg-center overflow-hidden"
                  style={{ backgroundImage: `url(${cardBackImage})` }}
                ></div>
              ))}

            {mePlayer?.length > 0 &&
              fistAllCardRender.current.mePlayer.map((e, i) => (
                <div
                  id={`card-${e.id}`}
                  key={`card-${e.id}`}
                  data-page={e.number}
                  onClick={(e) => cardClick(e)}
                  className="mycard w-14 h-24 md:w-32 md:h-44 z-10 bg-no-repeat bg-contain bg-center overflow-hidden"
                  style={{ backgroundImage: `url(${cardBackImage})` }}
                ></div>
              ))}

            {otherPlayer?.length > 0 &&
              fistAllCardRender.current.otherPlayer.map((e, i) => (
                <div
                  id={`card-${e.id}`}
                  key={`card-${e.id}`}
                  data-page={e.number}
                  onClick={(e) => cardClick(e)}
                  className="card w-14 h-24 md:w-32 md:h-44 z-10 bg-no-repeat bg-contain bg-center overflow-hidden"
                  style={{ backgroundImage: `url(${cardBackImage})` }}
                ></div>
              ))}
          </div>

          <div
            className={`h-36 md:h-60 w-full flex justify-center items-center relative ${
              onlyTargetPick ? "pickCardHighLight" : ""
            }`}
            id="target"
          ></div>
        </div>

        <div className="flex justify-between md:justify-around w-full md:w-2/3 px-0 py-10 md:m-2 ">
          {endGame ? (
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
            </div>
          ) : (
            <div className=" flex flex-col items-center">
              <img
                src="https://ahoygamesdotcom.b-cdn.net/wp-content/uploads/2022/05/Icon_GinRummy_1024_rounded.png"
                className="w-16 h-14"
              />
              <span className="text-sm text-white font-bold py-2">
                You (20)
              </span>
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
          className="flex justify-center items-end md:items-end h-24 md:h-36 transition-w"
          id="myUserCard"
        ></div>
      </div>

      <AdBanner
        dataAdFormat={"auto"}
        dataFullWidthResponsive={"true"}
        dataAdSlot={"2692189121"}
      />
    </div>
  );
}
