document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("pixel-character");
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;

  const bubble = document.getElementById("speech-bubble");
  const message = document.getElementById("message");
  const button = document.getElementById("character-button");

  const palette = {
    ".": null,
    H: "#2e1b17",
    S: "#f3c6a4",
    E: "#ffffff",
    O: "#251711",
    B: "#4c78d6",
    D: "#2f4aa3",
    P: "#3a3a78",
    K: "#5757aa",
    L: "#2f2f4d"
  };

  const sprites = {
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
      "........................"
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
      "........................"
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
      "........................"
    ]
  };

  const renderSprite = spriteData => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    spriteData.forEach((row, y) => {
      [...row].forEach((cell, x) => {
        const color = palette[cell];
        if (!color) return;
        ctx.fillStyle = color;
        ctx.fillRect(x, y, 1, 1);
      });
    });
  };

  let currentPose = "idle";

  const setPose = pose => {
    const spriteData = sprites[pose];
    if (!spriteData) return;
    currentPose = pose;
    renderSprite(spriteData);
  };

  setPose(currentPose);

  const poseTimeouts = [];

  const clearPoseTimeouts = () => {
    poseTimeouts.forEach(clearTimeout);
    poseTimeouts.length = 0;
  };

  const playBowingAnimation = () => {
    clearPoseTimeouts();
    button.classList.remove("bowing");
    setPose("bowPrep");
    // Force a reflow so the bowing class re-applies its transition each time.
    void button.offsetWidth;
    button.classList.add("bowing");
    poseTimeouts.push(setTimeout(() => setPose("bow"), 140));
    poseTimeouts.push(
      setTimeout(() => {
        button.classList.remove("bowing");
      }, 900)
    );
    poseTimeouts.push(setTimeout(() => setPose("idle"), 1300));
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
    "ごめんなさい、謝るセリフを考えていたら日が暮れていました。"
  ];

  let lastIndex = -1;

  const showRandomApology = () => {
    let index;
    do {
      index = Math.floor(Math.random() * apologies.length);
    } while (index === lastIndex && apologies.length > 1);

    lastIndex = index;
    message.textContent = apologies[index];
    bubble.classList.add("visible");
  };

  const handleInteraction = () => {
    showRandomApology();
    playBowingAnimation();
  };

  button.addEventListener("click", handleInteraction);

  setTimeout(() => {
    bubble.classList.add("visible");
  }, 200);
});
