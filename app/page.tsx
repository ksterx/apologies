"use client";

import clsx from "clsx";
import { useCallback, useEffect, useRef, useState } from "react";

type Pose = "idle" | "bowPrep" | "bow";

type Sprite = string[];

type Palette = Record<string, string | null>;

const palette: Palette = {
  ".": null,
  H: "#2e1b17",
  S: "#f3c6a4",
  E: "#ffffff",
  O: "#251711",
  B: "#4c78d6",
  D: "#2f4aa3",
  P: "#3a3a78",
  K: "#5757aa",
  L: "#2f2f4d",
};

const sprites: Record<Pose, Sprite> = {
  idle: [
    "........................",
    ".........HHHHHH.........",
    "........HHHHHHHH........",
    ".......HHSSSSSSHH.......",
    "......HSSSEEOOSSHH......",
    "......HSSSSSSSSHH.......",
    ".......HHSSSSSHH........",
    "......BBBDSSDBBB........",
    ".....BBBBDDDDBBBB.......",
    ".....BBBDDDDDDBBB.......",
    "....BBBBDDBBDDBBBB......",
    "....BBBBDDBBDDBBBB......",
    "....BBBBBDDDDBBBBB......",
    "...BBBBPPPPPPBBBBB......",
    "...BBBPPPPPPPPBBB.......",
    "..BBBPPPPPPPPPPBBB......",
    "..BBPPPKPPPPKPPBB.......",
    "..BBPPPPPPPPPPBB........",
    "...BBPPPPPPPPBB.........",
    "....BBPPPPPPBB..........",
    ".....LLPPPPPLL..........",
    "......LLPPPLL...........",
    ".......LLLL.............",
    "........................",
  ],
  bowPrep: [
    "........................",
    ".........HHHHHH.........",
    "........HHHHHHHH........",
    ".......HHSSSSSSHH.......",
    "......HSSSEEOOSSHH......",
    "......HSSSSSSSSHH.......",
    ".......HHSSSSSHH........",
    "......BBBDSSDBBB........",
    ".....BBBBDDDDBBBB.......",
    ".....BBBDDDDDDBBB.......",
    "....BBBBDDDDDDBBBB......",
    "...BBBBBDDDDDDBBBBB.....",
    "...BBBBPPPPPPBBBBB......",
    "..BBBBPPPPPPPPPBBBB.....",
    "..BBBPPPPPPPPPPBBB......",
    "..BBPPPKPPPPKPPBB.......",
    "..BBPPPPPPPPPPBB........",
    "...BBPPPPPPPPPBB........",
    "....BBPPPPPPBB..........",
    ".....BBPPPPBB...........",
    "......BBPPBB............",
    ".......LLPPLL...........",
    "........LLLL............",
    "........................",
  ],
  bow: [
    "........................",
    "........................",
    "........BBBBBBBB........",
    ".......BBBBBBBBBB.......",
    "......BBBDDDDDDBB.......",
    "......BBBDDDDDDBB.......",
    "......BBBPPPPPPBB.......",
    ".....BBBPPPPPPBBB.......",
    ".....BBPPPPPPPPBB.......",
    "....BBPPPPPPPPPPBB......",
    "....BBPPPKPPPKPPBB......",
    "...BBPPPPPPPPPPPPBB.....",
    "...BBPPPPPPPPPPPPBB.....",
    "...BBPPPPPPPPPPPPBB.....",
    "...BBPPPPPPPPPPPPBB.....",
    "....BBPPPPPPPPPPBB......",
    ".....BBLLLLLLLLBB.......",
    "......LLLLLLLLLL........",
    ".......HHHHHHHH.........",
    "......HHSSSSSSHH........",
    "......HHSSSSSSHH........",
    ".......HHHHHHHH.........",
    "........SSSSSS..........",
    "........................",
  ],
};

const apologies = [
  "ごめんなさい、猫に気を取られて返信が遅くなりました。",
  "ごめん…エアコンのリモコンを冷蔵庫にしまっていました。",
  "申し訳ないです、夢の中で会議をしていて遅れました。",
  "すまない、靴下が片方見つからなくて世界を探していました。",
  "ごめんなさい、はんこを探していたらタイムトラベルしてしまいました。",
  "ほんとにごめん、カレーの味を整えるのに全力でした。",
  "申し訳ありません、植物に話しかけていたら時間が溶けました。",
  "ごめん、洗濯ネットに自分も入ってしまい出られませんでした。",
  "すまぬ、Wi-Fiと心が一時的に断線していました。",
  "ごめんなさい、謝るセリフを考えていたら日が暮れていました。",
];

function renderSprite(
  context: CanvasRenderingContext2D,
  sprite: Sprite,
  paletteMap: Palette,
) {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  sprite.forEach((row, y) => {
    [...row].forEach((cell, x) => {
      const color = paletteMap[cell];
      if (!color) return;
      context.fillStyle = color;
      context.fillRect(x, y, 1, 1);
    });
  });
}

export default function HomePage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [pose, setPose] = useState<Pose>("idle");
  const [message, setMessage] = useState("ここをタップすると土下座するよ。");
  const [isBubbleVisible, setIsBubbleVisible] = useState(false);
  const [isBowing, setIsBowing] = useState(false);
  const lastIndexRef = useRef(-1);
  const timeoutsRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  const clearPoseTimeouts = useCallback(() => {
    timeoutsRef.current.forEach((timeoutId) => {
      clearTimeout(timeoutId);
    });
    timeoutsRef.current = [];
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }
    context.imageSmoothingEnabled = false;
    renderSprite(context, sprites[pose], palette);
  }, [pose]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsBubbleVisible(true);
    }, 200);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    return () => {
      clearPoseTimeouts();
    };
  }, [clearPoseTimeouts]);

  const showRandomApology = useCallback(() => {
    let index = -1;
    if (apologies.length === 0) {
      return "";
    }

    do {
      index = Math.floor(Math.random() * apologies.length);
    } while (index === lastIndexRef.current && apologies.length > 1);

    lastIndexRef.current = index;
    return apologies[index];
  }, []);

  const playBowingAnimation = useCallback(() => {
    clearPoseTimeouts();
    setIsBowing(false);
    setPose("bowPrep");

    const showBowingClass = window.setTimeout(() => {
      setIsBowing(true);
    }, 0);

    const bowTimeout = window.setTimeout(() => {
      setPose("bow");
    }, 140);

    const resetBowingClass = window.setTimeout(() => {
      setIsBowing(false);
    }, 900);

    const resetPose = window.setTimeout(() => {
      setPose("idle");
    }, 1300);

    timeoutsRef.current = [
      showBowingClass,
      bowTimeout,
      resetBowingClass,
      resetPose,
    ];
  }, [clearPoseTimeouts]);

  const handleInteraction = useCallback(() => {
    const apology = showRandomApology();
    if (apology) {
      setMessage(apology);
    }
    setIsBubbleVisible(true);
    playBowingAnimation();
  }, [playBowingAnimation, showRandomApology]);


  return (
    <main className="stage">
      <h1 className="title">タップすると謝ってくれるサイト</h1>
      <p className="subtitle">座っているドット絵キャラをタップしてみてください。</p>
      <button
        type="button"
        aria-describedby="instruction"
        className={clsx("character", { bowing: isBowing })}
        onClick={handleInteraction}
      >
        <canvas ref={canvasRef} width={24} height={24} aria-hidden="true" />
        <div
          className={clsx("speech-bubble", { visible: isBubbleVisible })}
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <p>{message}</p>
        </div>
      </button>
      <p id="instruction" className="instruction">
        キャラをタップまたはエンターキーで謝罪を聞けます。
      </p>
    </main>
  );
}
