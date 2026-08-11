/* =========================================================
   OSHAGH WEBSITE - MAIN SCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =======================================================
     NAVIGATION
  ======================================================= */

  const navLinks = document.querySelectorAll(".nav a");

  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      navLinks.forEach(item => item.classList.remove("active"));
      link.classList.add("active");
    });
  });


  /* =======================================================
     GAME MODAL
  ======================================================= */

  const gameModal = document.getElementById("gameModal");
  const playGameBtn = document.getElementById("playGameBtn");
  const closeGameBtn = document.getElementById("closeGame");
  const enterGameBtn = document.getElementById("enterGame");

  const playerNameInput = document.getElementById("playerName");
  const secretWordInput = document.getElementById("secretWord");
  const loginError = document.getElementById("loginError");


  function openGameModal() {
    if (!gameModal) return;

    gameModal.classList.add("show");

    setTimeout(() => {
      if (playerNameInput) {
        playerNameInput.focus();
      }
    }, 150);
  }


  function closeGameModal() {
    if (!gameModal) return;

    gameModal.classList.remove("show");

    if (loginError) {
      loginError.textContent = "";
    }
  }


  if (playGameBtn) {
    playGameBtn.addEventListener("click", openGameModal);
  }


  if (closeGameBtn) {
    closeGameBtn.addEventListener("click", closeGameModal);
  }


  if (gameModal) {
    gameModal.addEventListener("click", event => {
      if (event.target === gameModal) {
        closeGameModal();
      }
    });
  }


  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeGameModal();
    }
  });


  /* =======================================================
     GAME LOGIN
  ======================================================= */

  if (enterGameBtn) {

    enterGameBtn.addEventListener("click", () => {

      const name = playerNameInput
        ? playerNameInput.value.trim()
        : "";

      const word = secretWordInput
        ? secretWordInput.value.trim()
        : "";


      if (!name) {

        if (loginError) {
          loginError.textContent =
            "لطفاً نام خود را وارد کنید.";
        }

        return;
      }


      if (word !== "یاریکون") {

        if (loginError) {
          loginError.textContent =
            "عبارت واردشده درست نیست.";
        }

        return;
      }


      sessionStorage.setItem(
        "oshaghiPlayerName",
        name
      );


      closeGameModal();


      startGame(name);
    });
  }


  /* =======================================================
     GAME
  ======================================================= */

  const gameArea = document.getElementById("gameArea");
  const gameBoard = document.getElementById("gameBoard");
  const projectile = document.getElementById("gameProjectile");
  const scoreElement = document.getElementById("gameScore");
  const restartGameBtn = document.getElementById("restartGame");


  let score = 0;
  let dragging = false;
  let startX = 0;
  let startY = 0;


  function startGame(name) {

    if (!gameArea) return;

    gameArea.classList.add("show");

    gameArea.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });


    const playerNameElement =
      document.getElementById("gamePlayerName");

    if (playerNameElement) {
      playerNameElement.textContent = name;
    }


    resetGame();
  }


  function resetGame() {

    score = 0;

    updateScore();

    if (projectile) {

      projectile.style.left = "50%";
      projectile.style.bottom = "42px";
      projectile.style.top = "auto";
      projectile.style.transform =
        "translateX(-50%)";

    }
  }


  function updateScore() {

    if (scoreElement) {
      scoreElement.textContent = score;
    }
  }


  function showScore(target) {

    if (!target) return;

    const pop = document.createElement("div");

    pop.className = "score-pop";
    pop.textContent = "+10";

    target.appendChild(pop);

    setTimeout(() => {
      pop.remove();
    }, 2000);
  }


  function hitTarget(target) {

    if (!target) return;

    target.classList.add("hit");

    score += 10;

    updateScore();

    showScore(target);

    setTimeout(() => {
      target.classList.remove("hit");
    }, 350);
  }


  function checkCollision() {

    if (!projectile || !gameBoard) return;

    const projectileRect =
      projectile.getBoundingClientRect();

    const targets =
      document.querySelectorAll(".target");


    targets.forEach(target => {

      const targetRect =
        target.getBoundingClientRect();


      const collision =
        projectileRect.left <
          targetRect.right &&
        projectileRect.right >
          targetRect.left &&
        projectileRect.top <
          targetRect.bottom &&
        projectileRect.bottom >
          targetRect.top;


      if (collision) {

        hitTarget(target);

        projectile.style.left = "50%";
        projectile.style.bottom = "42px";
        projectile.style.top = "auto";
        projectile.style.transform =
          "translateX(-50%)";

      }

    });
  }


  if (projectile && gameBoard) {

    projectile.addEventListener(
      "pointerdown",
      event => {

        dragging = true;

        startX = event.clientX;
        startY = event.clientY;

        projectile.classList.add("dragging");

        projectile.setPointerCapture(
          event.pointerId
        );
      }
    );


    projectile.addEventListener(
      "pointermove",
      event => {

        if (!dragging) return;

        const dx = event.clientX - startX;
        const dy = event.clientY - startY;


        const maxX =
          gameBoard.clientWidth / 2 - 30;


        const limitedX =
          Math.max(
            -maxX,
            Math.min(maxX, dx)
          );


        const limitedY =
          Math.max(
            -180,
            Math.min(50, dy)
          );


        projectile.style.transform =
          `translateX(calc(-50% + ${limitedX}px))`;


        projectile.style.bottom =
          `${42 - limitedY}px`;
      }
    );


    projectile.addEventListener(
      "pointerup",
      event => {

        if (!dragging) return;

        dragging = false;

        projectile.classList.remove("dragging");

        projectile.releasePointerCapture(
          event.pointerId
        );


        launchProjectile();
      }
    );
  }


  function launchProjectile() {

    if (!projectile || !gameBoard) return;


    const startRect =
      projectile.getBoundingClientRect();

    const boardRect =
      gameBoard.getBoundingClientRect();


    const startLeft =
      startRect.left -
      boardRect.left;


    const startBottom =
      boardRect.bottom -
      startRect.bottom;


    projectile.style.transition =
      "left .75s ease-out, bottom .75s ease-out";


    projectile.style.left =
      `${startLeft}px`;


    projectile.style.bottom =
      `${Math.min(
        gameBoard.clientHeight - 60,
        startBottom + 280
      )}px`;


    setTimeout(() => {

      checkCollision();

      projectile.style.transition = "none";

      projectile.style.left = "50%";
      projectile.style.bottom = "42px";
      projectile.style.top = "auto";
      projectile.style.transform =
        "translateX(-50%)";

    }, 800);
  }


  if (restartGameBtn) {
    restartGameBtn.addEventListener(
      "click",
      resetGame
    );
  }


  /* =======================================================
     MUSIC PLAYER
  ======================================================= */

  const audioPlayer =
    document.getElementById("audioPlayer");

  const musicPlayButton =
    document.getElementById("musicPlayButton");

  const musicProgress =
    document.getElementById("musicProgress");

  const currentTrackTitle =
    document.getElementById("currentTrackTitle");


  let currentMusic = null;


  function playMusic(src, title) {

    if (!audioPlayer) return;


    currentMusic = src;

    audioPlayer.src = src;

    audioPlayer.play().catch(() => {});


    if (currentTrackTitle) {
      currentTrackTitle.textContent =
        title || "موزیک عشاق";
    }


    if (musicPlayButton) {
      musicPlayButton.textContent = "Ⅱ";
    }
  }


  if (musicPlayButton && audioPlayer) {

    musicPlayButton.addEventListener(
      "click",
      () => {

        if (!audioPlayer.src) return;


        if (audioPlayer.paused) {

          audioPlayer.play();

          musicPlayButton.textContent = "Ⅱ";

        } else {

          audioPlayer.pause();

          musicPlayButton.textContent = "▶";

        }
      }
    );
  }


  if (audioPlayer) {

    audioPlayer.addEventListener(
      "timeupdate",
      () => {

        if (!audioPlayer.duration) return;


        const percent =
          (audioPlayer.currentTime /
            audioPlayer.duration) * 100;


        if (musicProgress) {
          musicProgress.style.width =
            `${percent}%`;
        }
      }
    );


    audioPlayer.addEventListener(
      "ended",
      () => {

        if (musicPlayButton) {
          musicPlayButton.textContent = "▶";
        }

        if (musicProgress) {
          musicProgress.style.width = "0%";
        }
      }
    );
  }


  /* =======================================================
     MUSIC ITEMS
  ======================================================= */

  document.addEventListener(
    "click",
    event => {

      const button =
        event.target.closest(
          ".music-play-btn"
        );


      if (!button) return;


      const item =
        button.closest(".music-item");


      if (!item) return;


      const source =
        item.dataset.src;


      const title =
        item.dataset.title ||
        item.querySelector("h4")?.textContent ||
        "موزیک عشاق";


      if (!source) return;


      document
        .querySelectorAll(".music-item")
        .forEach(el => {
          el.classList.remove("playing");
        });


      item.classList.add("playing");


      playMusic(source, title);
    }
  );


  /* =======================================================
     MUSIC PROGRESS CLICK
  ======================================================= */

  const progressContainer =
    document.getElementById(
      "musicProgressContainer"
    );


  if (progressContainer && audioPlayer) {

    progressContainer.addEventListener(
      "click",
      event => {

        if (!audioPlayer.duration) return;


        const rect =
          progressContainer.getBoundingClientRect();


        const percent =
          (event.clientX - rect.left) /
          rect.width;


        audioPlayer.currentTime =
          audioPlayer.duration *
          Math.max(0, Math.min(1, percent));
      }
    );
  }


  /* =======================================================
     ADMIN UPLOAD BUTTONS
  ======================================================= */

  const uploadLinks =
    document.querySelectorAll(".upload-link");


  uploadLinks.forEach(link => {

    link.addEventListener(
      "click",
      event => {

        event.preventDefault();

        window.location.href =
          "admin.html";
      }
    );
  });


  /* =======================================================
     LOAD SAVED PLAYER NAME
  ======================================================= */

  const savedName =
    sessionStorage.getItem(
      "oshaghiPlayerName"
    );


  const gamePlayerName =
    document.getElementById(
      "gamePlayerName"
    );


  if (savedName && gamePlayerName) {
    gamePlayerName.textContent =
      savedName;
  }


  /* =======================================================
     YEAR
  ======================================================= */

  const year =
    document.getElementById("year");


  if (year) {
    year.textContent =
      new Date().getFullYear();
  }

});
