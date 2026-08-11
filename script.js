/* =========================================================
   OSHAGH — MAIN SCRIPT
   Navigation + Game + Music
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
     REFRESH → TOP
  ======================================================= */

  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  if (!window.location.hash) {
    window.scrollTo(0, 0);
  }


  /* =======================================================
     GAME ELEMENTS
  ======================================================= */

  const gameBoard = document.getElementById("gameBoard");
  const projectile = document.getElementById("gameProjectile");
  const playGameBtn = document.getElementById("playGameBtn");
  const gameScore = document.getElementById("gameScore");
  const gameMessage = document.getElementById("gameMessage");

  const playerNameInput = document.getElementById("playerName");
  const secretWordInput = document.getElementById("secretWord");
  const enterGameBtn = document.getElementById("enterGame");
  const loginError = document.getElementById("loginError");
  const gameModal = document.getElementById("gameModal");
  const closeGame = document.getElementById("closeGame");

  const slingshot = document.getElementById("slingshot");
  const slingBand = document.getElementById("slingBand");


  /* =======================================================
     GAME STATE
  ======================================================= */

  let score = 0;

  let dragging = false;

  let flying = false;

  let animationFrame = null;

  let lastTime = 0;

  let pointerId = null;

  let ballX = 0;
  let ballY = 0;

  let baseX = 0;
  let baseY = 0;

  let dragX = 0;
  let dragY = 0;

  let velocityX = 0;
  let velocityY = 0;

  let rotation = 0;

  const MAX_DRAG = 115;

  const POWER = 5.2;

  const GRAVITY = 720;

  const MAX_SPEED = 1150;


  /* =======================================================
     TARGETS
  ======================================================= */

  const targets =
    document.querySelectorAll(".target");


  targets.forEach(target => {

    const name =
      target.dataset.name ||
      target.textContent.trim();

    target.innerHTML =
      `<span>${name}</span>`;

  });


  /* =======================================================
     GAME MODAL
  ======================================================= */

  function openGameModal() {

    if (!gameModal) {
      startGame();
      return;
    }

    gameModal.classList.add("show");

    if (playerNameInput) {
      setTimeout(() => {
        playerNameInput.focus();
      }, 100);
    }
  }


  function closeGameModal() {

    if (!gameModal) return;

    gameModal.classList.remove("show");

    if (loginError) {
      loginError.textContent = "";
    }
  }


  if (playGameBtn) {

    playGameBtn.addEventListener(
      "click",
      openGameModal
    );

  }


  if (closeGame) {

    closeGame.addEventListener(
      "click",
      closeGameModal
    );

  }


  if (gameModal) {

    gameModal.addEventListener(
      "click",
      event => {

        if (event.target === gameModal) {
          closeGameModal();
        }

      }
    );

  }


  /* =======================================================
     GAME LOGIN
  ======================================================= */

  if (enterGameBtn) {

    enterGameBtn.addEventListener(
      "click",
      () => {

        const name =
          playerNameInput
            ? playerNameInput.value.trim()
            : "";

        const secret =
          secretWordInput
            ? secretWordInput.value.trim()
            : "";


        if (!name) {

          if (loginError) {
            loginError.textContent =
              "لطفاً نام خود را وارد کنید.";
          }

          return;
        }


        if (secret !== "یاریکون") {

          if (loginError) {
            loginError.textContent =
              "عبارت ورود صحیح نیست.";
          }

          return;
        }


        sessionStorage.setItem(
          "oshaghiPlayerName",
          name
        );


        closeGameModal();

        startGame();

      }
    );

  }


  /* =======================================================
     GAME POSITION
  ======================================================= */

  function calculateBasePosition() {

    if (!gameBoard) return;

    const width =
      gameBoard.clientWidth;

    const height =
      gameBoard.clientHeight;


    /*
      تیرکمان سمت چپ
    */

    baseX =
      Math.max(
        100,
        width * 0.18
      );


    baseY =
      height * 0.73;


    ballX = baseX;
    ballY = baseY;

    renderBall();

  }


  /* =======================================================
     RENDER BALL
  ======================================================= */

  function renderBall() {

    if (!projectile) return;

    projectile.style.left =
      `${ballX}px`;

    projectile.style.top =
      `${ballY}px`;

    projectile.style.bottom =
      "auto";

    projectile.style.transform =
      `translate(-50%, -50%) rotate(${rotation}deg)`;

  }


  /* =======================================================
     RESET SLINGSHOT
  ======================================================= */

  function resetSlingshot() {

    dragX = 0;
    dragY = 0;

    if (slingBand) {

      slingBand.style.transform =
        "translate(0, 0)";

    }

    if (slingshot) {

      slingshot.classList.remove(
        "pulling"
      );

    }

  }


  /* =======================================================
     RESET PROJECTILE
  ======================================================= */

  function resetProjectile() {

    flying = false;

    dragging = false;

    velocityX = 0;
    velocityY = 0;

    rotation = 0;

    calculateBasePosition();

    resetSlingshot();

    if (projectile) {

      projectile.style.visibility =
        "visible";

    }

    if (gameMessage) {

      gameMessage.textContent =
        "سنگ را بکش و رها کن";

    }

  }


  /* =======================================================
     START GAME
  ======================================================= */

  function startGame() {

    if (!gameBoard) return;

    score = 0;

    if (gameScore) {
      gameScore.textContent = "0";
    }


    targets.forEach(target => {

      target.classList.remove(
        "hit"
      );

      target.style.opacity =
        "1";

    });


    gameBoard.classList.add(
      "game-active"
    );


    requestAnimationFrame(() => {
      resetProjectile();
    });


    gameBoard.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

  }


  /* =======================================================
     POINTER DOWN
  ======================================================= */

  if (projectile) {

    projectile.addEventListener(
      "pointerdown",
      event => {

        if (flying) return;

        dragging = true;

        pointerId =
          event.pointerId;


        projectile.setPointerCapture(
          pointerId
        );


        if (slingshot) {

          slingshot.classList.add(
            "pulling"
          );

        }


        event.preventDefault();

      }
    );


    /* =====================================================
       POINTER MOVE
    ===================================================== */

    projectile.addEventListener(
      "pointermove",
      event => {

        if (!dragging || flying) {
          return;
        }


        updateDrag(
          event.clientX,
          event.clientY
        );


        event.preventDefault();

      }
    );


    /* =====================================================
       POINTER UP
    ===================================================== */

    projectile.addEventListener(
      "pointerup",
      event => {

        if (!dragging) {
          return;
        }


        dragging = false;


        try {

          projectile.releasePointerCapture(
            pointerId
          );

        } catch (_) {}


        if (slingshot) {

          slingshot.classList.remove(
            "pulling"
          );

        }


        launch();

      }
    );


    projectile.addEventListener(
      "pointercancel",
      () => {

        dragging = false;

        resetProjectile();

      }
    );

  }


  /* =======================================================
     UPDATE DRAG
  ======================================================= */

  function updateDrag(
    clientX,
    clientY
  ) {

    if (!gameBoard) return;


    const rect =
      gameBoard.getBoundingClientRect();


    let dx =
      clientX -
      rect.left -
      baseX;


    let dy =
      clientY -
      rect.top -
      baseY;


    const distance =
      Math.sqrt(
        dx * dx +
        dy * dy
      );


    if (distance > MAX_DRAG) {

      const factor =
        MAX_DRAG / distance;

      dx *= factor;
      dy *= factor;

    }


    dragX = dx;
    dragY = dy;


    ballX =
      baseX + dx;

    ballY =
      baseY + dy;


    renderBall();


    /*
      کش لاستیکی تیرکمان
    */

    if (slingBand) {

      const angle =
        Math.atan2(
          dy,
          dx
        ) * 180 / Math.PI;


      slingBand.style.transform =
        `translate(${dx}px, ${dy}px) rotate(${angle}deg)`;

    }

  }


  /* =======================================================
     LAUNCH
  ======================================================= */

  function launch() {

    const power =
      Math.sqrt(
        dragX * dragX +
        dragY * dragY
      );


    if (power < 10) {

      resetProjectile();

      return;

    }


    /*
      بسیار مهم:

      جهت پرتاب = خلاف جهت کشیدن

      کشیدن چپ  → حرکت راست
      کشیدن راست → حرکت چپ
      کشیدن بالا → حرکت پایین
      کشیدن پایین → حرکت بالا
    */

    velocityX =
      -dragX * POWER;

    velocityY =
      -dragY * POWER;


    /*
      محدود کردن سرعت
    */

    const speed =
      Math.sqrt(
        velocityX * velocityX +
        velocityY * velocityY
      );


    if (speed > MAX_SPEED) {

      const factor =
        MAX_SPEED / speed;

      velocityX *= factor;
      velocityY *= factor;

    }


    flying = true;

    lastTime =
      performance.now();


    if (gameMessage) {

      gameMessage.textContent =
        "پرتاب شد!";

    }


    animationFrame =
      requestAnimationFrame(
        animateProjectile
      );

  }


  /* =======================================================
     PHYSICS
  ======================================================= */

  function animateProjectile(
    timestamp
  ) {

    if (!flying) return;


    let dt =
      (timestamp - lastTime) /
      1000;


    lastTime =
      timestamp;


    dt =
      Math.min(
        dt,
        0.025
      );


    /*
      جاذبه
    */

    velocityY +=
      GRAVITY * dt;


    /*
      حرکت
    */

    ballX +=
      velocityX * dt;

    ballY +=
      velocityY * dt;


    /*
      چرخش سنگ
    */

    rotation +=
      velocityX * dt * 0.08;


    renderBall();


    /*
      برخورد
    */

    if (checkTargets()) {

      finishShot();

      return;

    }


    /*
      خروج از صفحه
    */

    const width =
      gameBoard.clientWidth;

    const height =
      gameBoard.clientHeight;


    if (
      ballX < -100 ||
      ballX > width + 100 ||
      ballY < -150 ||
      ballY > height + 100
    ) {

      finishShot();

      return;

    }


    animationFrame =
      requestAnimationFrame(
        animateProjectile
      );

  }


  /* =======================================================
     COLLISION
  ======================================================= */

  function checkTargets() {

    if (!projectile) {
      return false;
    }


    const ballRect =
      projectile.getBoundingClientRect();


    let hit = false;


    targets.forEach(target => {

      if (
        target.classList.contains(
          "hit"
        )
      ) {
        return;
      }


      const rect =
        target.getBoundingClientRect();


      const collision =

        ballRect.left <
        rect.right &&

        ballRect.right >
        rect.left &&

        ballRect.top <
        rect.bottom &&

        ballRect.bottom >
        rect.top;


      if (collision) {

        hitTarget(target);

        hit = true;

      }

    });


    return hit;

  }


  /* =======================================================
     HIT TARGET
  ======================================================= */

  function hitTarget(target) {

    if (!target) return;


    target.classList.add(
      "hit"
    );


    score += 1;


    if (gameScore) {

      gameScore.textContent =
        score;

    }


    /*
      +1
    */

    const plus =
      document.createElement(
        "div"
      );


    plus.className =
      "score-pop";


    plus.textContent =
      "+1";


    target.appendChild(
      plus
    );


    /*
      ستاره
    */

    const star =
      document.createElement(
        "div"
      );


    star.className =
      "target-star";


    star.textContent =
      "★";


    target.appendChild(
      star
    );


    setTimeout(() => {

      plus.remove();
      star.remove();

    }, 2000);


    if (gameMessage) {

      gameMessage.textContent =
        `هدف «${target.dataset.name}» زده شد! +1`;

    }

  }


  /* =======================================================
     FINISH SHOT
  ======================================================= */

  function finishShot() {

    flying = false;


    if (animationFrame) {

      cancelAnimationFrame(
        animationFrame
      );

      animationFrame = null;

    }


    setTimeout(() => {

      resetProjectile();

    }, 400);

  }


  /* =======================================================
     RESTART
  ======================================================= */

  const restartButton =
    document.getElementById(
      "restartGame"
    );


  if (restartButton) {

    restartButton.addEventListener(
      "click",
      resetProjectile
    );

  }


  /* =======================================================
     MUSIC
  ======================================================= */

  const audioPlayer =
    document.getElementById(
      "audioPlayer"
    );

  const musicPlayButton =
    document.getElementById(
      "musicPlayButton"
    );

  const currentTrackTitle =
    document.getElementById(
      "currentTrackTitle"
    );

  const musicProgress =
    document.getElementById(
      "musicProgress"
    );

  const musicProgressContainer =
    document.getElementById(
      "musicProgressContainer"
    );


  function playMusic(
    src,
    title
  ) {

    if (!audioPlayer || !src) {
      return;
    }


    audioPlayer.src =
      src;


    audioPlayer.play()
      .catch(() => {});


    if (currentTrackTitle) {

      currentTrackTitle.textContent =
        title ||
        "موزیک عشاق";

    }


    if (musicPlayButton) {

      musicPlayButton.textContent =
        "Ⅱ";

    }

  }


  if (musicPlayButton) {

    musicPlayButton.addEventListener(
      "click",
      () => {

        if (!audioPlayer.src) {
          return;
        }


        if (audioPlayer.paused) {

          audioPlayer.play();

          musicPlayButton.textContent =
            "Ⅱ";

        } else {

          audioPlayer.pause();

          musicPlayButton.textContent =
            "▶";

        }

      }
    );

  }


  if (audioPlayer) {

    audioPlayer.addEventListener(
      "timeupdate",
      () => {

        if (
          !audioPlayer.duration ||
          !musicProgress
        ) {
          return;
        }


        const percent =
          (
            audioPlayer.currentTime /
            audioPlayer.duration
          ) * 100;


        musicProgress.style.width =
          `${percent}%`;

      }
    );


    audioPlayer.addEventListener(
      "ended",
      () => {

        if (musicPlayButton) {

          musicPlayButton.textContent =
            "▶";

        }

        if (musicProgress) {

          musicProgress.style.width =
            "0%";

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
        button.closest(
          ".music-item"
        );


      if (!item) return;


      const src =
        item.dataset.src;


      const title =
        item.dataset.title ||
        item.querySelector("h4")
          ?.textContent ||
        "موزیک عشاق";


      if (!src) return;


      document
        .querySelectorAll(
          ".music-item"
        )
        .forEach(el => {

          el.classList.remove(
            "playing"
          );

        });


      item.classList.add(
        "playing"
      );


      playMusic(
        src,
        title
      );

    }
  );


  /* =======================================================
     MUSIC PROGRESS SEEK
  ======================================================= */

  if (musicProgressContainer) {

    musicProgressContainer.addEventListener(
      "click",
      event => {

        if (!audioPlayer.duration) {
          return;
        }


        const rect =
          musicProgressContainer
            .getBoundingClientRect();


        const percent =
          (
            event.clientX -
            rect.left
          ) / rect.width;


        audioPlayer.currentTime =
          audioPlayer.duration *
          Math.max(
            0,
            Math.min(
              1,
              percent
            )
          );

      }
    );

  }


  /* =======================================================
     ADMIN LINKS
  ======================================================= */

  document
    .querySelectorAll(
      ".upload-link"
    )
    .forEach(link => {

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
     YEAR
  ======================================================= */

  const year =
    document.getElementById(
      "year"
    );


  if (year) {

    year.textContent =
      new Date().getFullYear();

  }


  /* =======================================================
     SAVED PLAYER
  ======================================================= */

  const savedName =
    sessionStorage.getItem(
      "oshaghiPlayerName"
    );


  const playerName =
    document.getElementById(
      "gamePlayerName"
    );


  if (
    savedName &&
    playerName
  ) {

    playerName.textContent =
      savedName;

  }

});
