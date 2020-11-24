document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementsByClassName("grid")[0];
  const platforms = [];
  let gridSize = 500;
  let movingTiming = 0;
  let jumpingTiming = 0;
  let doodlePosition = 0;
  let score = 0;

  function createPlatform(spaceFromTop) {
    const obj = new Platform(gridSize, spaceFromTop);
    platforms.push(obj);
    grid.appendChild(obj.visual);
    console.log(obj);
  }

  function initGrid() {
    grid.innerHTML = "";
    platforms.length = 0;
    for (let index = 0; index < 5; index++) {
      createPlatform(platforms.length * 120);
    }
    const doodle = document.createElement("div");
    doodle.style.left = platforms[platforms.length - 1].left + 10 + "px";
    doodlePosition = platforms[platforms.length - 1].top - 73;
    doodle.style.top = doodlePosition + "px";
    doodle.classList.add("doodle");
    grid.appendChild(doodle);
  }

  function moveGrid() {
    movingTiming = setInterval(() => {
      platforms.forEach((p) => {
        p.top += 1;
        p.visual.style.top = p.top + "px";
        if (p.top > 1200) {
          p.visual.remove();
        }
      });
      if (platforms[platforms.length - 1].top > 100) createPlatform(-30);
    }, 10);
  }

  function startJumpingDoodle() {
    const doodle = document.getElementsByClassName("doodle")[0];
    let isJumping = true;
    let t0 = performance.now();
    jumpingTiming = setInterval(() => {
      const doodleLeft = +doodle.style.left.replace("px", "");
      if (isJumping) {
        doodlePosition = doodlePosition - 4;
      } else {
        doodlePosition = doodlePosition + 4;
      }
      if (
        platforms.some(
          (p) =>
            p.top < doodlePosition + 50 &&
            p.top > doodlePosition &&
            doodleLeft > p.left - 70 &&
            doodleLeft < p.left + 70 &&
            !isJumping
        )
      ) {
        playJump();
        isJumping = true;
        t0 = performance.now();
        claculateScore();
      }
      if (isJumping && performance.now() - t0 > 500) {
        isJumping = false;
        t0 = performance.now();
      }
      doodle.style.top = doodlePosition + "px";
      if (!isJumping && doodlePosition > 570) {
        gaveOver();
      }
    }, 8);
  }

  function gaveOver() {
    clearInterval(movingTiming);
    clearInterval(jumpingTiming);
    alert("game over");
  }

  function startGame() {
    score = 0;
    clearInterval(movingTiming);
    clearInterval(jumpingTiming);
    initGrid();
    moveGrid();
    startJumpingDoodle();
  }

  function claculateScore() {
    score += 10;
    document.getElementById("score").innerText = `Score = ${score}`;
  }

  function playJump() {
    var sound = document.getElementById("jump-sound");
    sound.play();
  }

  document.addEventListener("keydown", (e) => {
    const doodle = document.getElementsByClassName("doodle")[0];
    const left = +doodle.style.left.replace("px", "");
    if (e.key == "ArrowLeft") {
      if (left <= 30) return;
      doodle.style.left = left - 50 + "px";
    } else if (e.key == "ArrowRight") {
      if (left >= 400) return;
      doodle.style.left = left + 50 + "px";
    } else if (e.code == "Space") {
      startGame();
    }
  });
  initGrid();
});

class Platform {
  constructor(gridSize, spaceFromTop) {
    this.left = Math.random() * (gridSize - 80);
    this.top = spaceFromTop;
    this.visual = document.createElement("div");
    this.visual.classList.add("platform");
    this.visual.style.left = this.left + "px";
    this.visual.style.top = this.top + "px";
  }
}
