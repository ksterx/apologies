document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("pixel-character");
  const ctx = canvas.getContext("2d");
  const bubble = document.getElementById("speech-bubble");
  const message = document.getElementById("message");
  const button = document.getElementById("character-button");

  // シンプルで分かりやすい座っているキャラクター
  const palette = {
    ".": null,
    "B": "#2d2d3d",  // 黒髪
    "S": "#ffd4a3",  // 肌色
    "W": "#ffffff",  // 白（目）
    "E": "#333333",  // 黒（目）
    "R": "#ff6b6b",  // 赤（服）
    "D": "#c92a2a",  // 濃い赤（服の影）
    "P": "#4a5568",  // ズボン
    "O": "#8b7355"   // 茶色（靴）
  };

  const sprite = [
    "................",
    ".....BBBBBB.....",
    "....BBBBBBBB....",
    "....SSSSSSSS....",
    "...WSSEESSESS...",
    "...SSSSSSSSSS...",
    "....SSSSSSSS....",
    "....RRRRRRRR....",
    "...RRRRRRRRRR...",
    "...RDRRRRRRRD...",
    "..RRRRRRRRRRRR..",
    "...PPPPPPPPPP...",
    "...PP......PP...",
    "...PP......PP...",
    "..OOO......OOO..",
    "................"
  ];

  const drawPixelArt = () => {
    sprite.forEach((row, y) => {
      [...row].forEach((cell, x) => {
        const color = palette[cell];
        if (!color) return;
        ctx.fillStyle = color;
        ctx.fillRect(x, y, 1, 1);
      });
    });
  };

  drawPixelArt();

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

  button.addEventListener("click", showRandomApology);

  setTimeout(() => {
    bubble.classList.add("visible");
  }, 200);
});
