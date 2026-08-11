/* =========================================================
   OSHAGH WEBSITE - MAIN SCRIPT
   نسخه اصلاح‌شده
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
     PREVENT REFRESH FROM RESTORING OLD SCROLL POSITION
  ======================================================= */

  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  window.addEventListener("load", () => {
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
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

    playGameBtn.addEventListener(
      "click",
      openGameModal
    );

  }


  if (closeGameBtn) {

    closeGameBtn.addEventListener(
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


  document.addEventListener(
    "keydown",
    event => {

      if (event.key === "Escape") {
        closeGameModal();
      }

    }
  );


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


        const word =
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

      }
    );

  }


  /* =======================================================
     GAME
  ======================================================= */

  const gameArea =
    document.getElementById("gameArea");

  const gameBoard =
    document.getElementById("gameBoard");

  const projectile =
    document.getElementById("gameProjectile");

  const scoreElement =
    document.getElementById("gameScore");

  const restartGameBtn =
    document.getElementById("restartGame");


  let score = 0;

  let dragging = false;

  let gameRunning = false;

  let animationFrame = null;

  let pointerId = null;

  let dragX = 0;

  let dragY = 0;

  let velocityX = 0;

  let velocityY = 0;

  let ballX = 0;

  let ballY = 0;

  let baseX = 0;

  let baseY = 0;

  let lastTime = 0;

  let hitTargets = new Set();


  const GRAVITY = 720;

  const POWER = 5.2;

  const MAX_DRAG = 115;


  /* -------------------------------------------------------
     GAME POSITION
  ------------------------------------------------------- */

  function getBasePosition() {

    if (!gameBoard || !projectile) {
      return {
        x: 0,
        y: 0
      };
    }


    const boardRect =
      gameBoard.getBoundingClientRect();

    const ballRect =
      projectile.getBoundingClientRect();


    return {

      x:
        ballRect.left -
        boardRect.left +
        ballRect.width / 2,

      y:
        ballRect.top -
        boardRect.top +
        ballRect.height / 2

    };
  }


  function resetProjectilePosition() {

    if (!projectile || !gameBoard) {
      return;
    }


    const boardWidth =
      gameBoard.clientWidth;

    const boardHeight =
      gameBoard.clientHeight;


    /*
      تیرکمان در سمت چپ قرار دارد.
    */

    baseX =
      Math.max(
        85,
        Math.min(
          150,
          boardWidth * 0.20
        )
      );


    baseY =
      boardHeight - 105;


    ballX = baseX;
    ballY = baseY;


    projectile.style.left =
      `${ballX}px`;

    projectile.style.top =
      `${ballY}px`;

    projectile.style.bottom =
      "auto";

    projectile.style.transform =
      "translate(-50%, -50%)";


    projectile.style.transition =
      "none";


    projectile.style.visibility =
      "visible";
  }


  /* -------------------------------------------------------
     GAME START
  ------------------------------------------------------- */

  function startGame(name) {

    if (!gameArea || !gameBoard) {
      return;
    }


    gameArea.classList.add("show");


    /*
      بازی را کمی بعد از باز شدن اجرا می‌کنیم
      تا ابعاد Board درست محاسبه شود.
    */

    requestAnimationFrame(() => {

      resetGame();

      const playerNameElement =
        document.getElementById(
          "gamePlayerName"
        );


      if (playerNameElement) {

        playerNameElement.textContent =
          name;

      }

    });


    gameArea.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

  }


  /* -------------------------------------------------------
     RESET GAME
  ------------------------------------------------------- */

  function resetGame() {

    if (!gameBoard || !projectile) {
      return;
    }


    if (animationFrame) {

      cancelAnimationFrame(
        animationFrame
      );

      animationFrame = null;
    }


    score = 0;

    dragging = false;

    gameRunning = false;

    velocityX = 0;

    velocityY = 0;

    dragX = 0;

    dragY = 0;

    hitTargets.clear();


    updateScore();

    resetProjectilePosition();


    document
      .querySelectorAll(".target")
      .forEach(target => {

        target.classList.remove(
          "hit"
        );

        target.style.opacity = "1";

        target.style.pointerEvents =
          "auto";

      });


    const message =
      document.getElementById(
        "gameMessage"
      );


    if (message) {

      message.textContent =
        "سنگ را بکش و رها کن";

    }

  }


  /* -------------------------------------------------------
     SCORE
  ------------------------------------------------------- */

  function updateScore() {

    if (scoreElement) {
      scoreElement.textContent =
        score;
    }

  }


  /* -------------------------------------------------------
     SCORE POP
  ------------------------------------------------------- */

  function showScore(target) {

    if (!target) return;


    const pop =
      document.createElement(
        "div"
      );


    pop.className =
      "score-pop";


    pop.textContent =
      "+1";


    target.appendChild(pop);


    const star =
      document.createElement(
        "span"
      );


    star.textContent =
      "★";


    star.style.position =
      "absolute";

    star.style.right =
      "-12px";

    star.style.top =
      "-15px";

    star.style.color =
      "#3688be";

    star.style.fontSize =
      "16px";


    target.appendChild(star);


    setTimeout(() => {

      pop.remove();

      star.remove();

    }, 2000);

  }


  /* -------------------------------------------------------
     HIT TARGET
  ------------------------------------------------------- */

  function hitTarget(target) {

    if (!target) return;


    if (hitTargets.has(target)) {
      return;
    }


    hitTargets.add(target);


    target.classList.add(
      "hit"
    );


    score += 1;

    updateScore();

    showScore(target);


    const message =
      document.getElementById(
        "gameMessage"
      );


    if (message) {

      message.textContent =
        "هدف زده شد! +1";

    }


    setTimeout(() => {

      target.classList.remove(
        "hit"
      );

    }, 350);

  }


  /* -------------------------------------------------------
     TARGET COLLISION
  ------------------------------------------------------- */

  function checkCollision() {

    if (!projectile || !gameBoard) {
      return false;
    }


    const ballRect =
      projectile.getBoundingClientRect();


    const targets =
      document.querySelectorAll(
        ".target"
      );


    let collided = false;


    targets.forEach(target => {

      if (
        hitTargets.has(target)
      ) {
        return;
      }


      const targetRect =
        target.getBoundingClientRect();


      const collision =

        ballRect.left <
        targetRect.right &&

        ballRect.right >
        targetRect.left &&

        ballRect.top <
        targetRect.bottom &&

        ballRect.bottom >
        targetRect.top;


      if (collision) {

        hitTarget(target);

        collided = true;

      }

    });


    return collided;
  }


  /* -------------------------------------------------------
     DRAW DRAG POSITION
  ------------------------------------------------------- */

  function updateDragPosition(
    clientX,
    clientY
  ) {

    if (
      !gameBoard ||
      !projectile ||
      gameRunning
    ) {
      return;
    }


    const boardRect =
      gameBoard.getBoundingClientRect();


    let pointerX =
      clientX -
      boardRect.left;


    let pointerY =
      clientY -
      boardRect.top;


    /*
      اختلاف موقعیت اشاره‌گر
      نسبت به نقطه شروع تیرکمان
    */

    let dx =
      pointerX - baseX;

    let dy =
      pointerY - baseY;


    /*
      برای تیرکمان:
      سنگ فقط می‌تواند اطراف نقطه شروع
      کشیده شود.
    */

    const distance =
      Math.sqrt(
        dx * dx +
        dy * dy
      );


    if (
      distance > MAX_DRAG
    ) {

      const scale =
        MAX_DRAG /
        distance;


      dx *= scale;
      dy *= scale;

    }


    /*
      سنگ را دقیقاً در نقطه کشیده‌شده
      قرار می‌دهیم.
    */

    ballX =
      baseX + dx;

    ballY =
      baseY + dy;


    projectile.style.left =
      `${ballX}px`;

    projectile.style.top =
      `${ballY}px`;

    projectile.style.bottom =
      "auto";


    projectile.style.transform =
      "translate(-50%, -50%)";


    dragX = dx;

    dragY = dy;


    /*
      کشش تیرکمان
      با CSS
    */

    drawSlingshot(
      dx,
      dy
    );

  }


  /* -------------------------------------------------------
     SLINGSHOT VISUAL
  ------------------------------------------------------- */

  function drawSlingshot(
    dx,
    dy
  ) {

    const leftBand =
      document.getElementById(
        "slingLeft"
      );

    const rightBand =
      document.getElementById(
        "slingRight"
      );


    if (
      !leftBand ||
      !rightBand
    ) {
      return;
    }


    leftBand.style.transform =
      `translate(${dx}px, ${dy}px)`;

    rightBand.style.transform =
      `translate(${dx}px, ${dy}px)`;

  }


  /* -------------------------------------------------------
     POINTER DOWN
  ------------------------------------------------------- */

  if (
    projectile &&
    gameBoard
  ) {

    projectile.addEventListener(
      "pointerdown",
      event => {

        if (gameRunning) {
          return;
        }


        dragging = true;

        pointerId =
          event.pointerId;


        projectile.setPointerCapture(
          pointerId
        );


        projectile.classList.add(
          "dragging"
        );


        updateDragPosition(
          event.clientX,
          event.clientY
        );


        event.preventDefault();

      }
    );


    /* -----------------------------------------------------
       POINTER MOVE
    ----------------------------------------------------- */

    projectile.addEventListener(
      "pointermove",
      event => {

        if (
          !dragging ||
          gameRunning
        ) {
          return;
        }


        updateDragPosition(
          event.clientX,
          event.clientY
        );


        event.preventDefault();

      }
    );


    /* -----------------------------------------------------
       POINTER UP
    ----------------------------------------------------- */

    projectile.addEventListener(
      "pointerup",
      event => {

        if (!dragging) {
          return;
        }


        dragging = false;


        projectile.classList.remove(
          "dragging"
        );


        try {

          projectile.releasePointerCapture(
            pointerId
          );

        } catch (_) {}


        /*
          اگر تقریباً نکشیده شده،
          پرتاب نکن.
        */

        const power =
          Math.sqrt(
            dragX * dragX +
            dragY * dragY
          );


        if (power < 12) {

          resetProjectilePosition();

          return;

        }


        /*
          جهت پرتاب دقیقاً خلاف
          جهت کشیدن سنگ است.
        */

        velocityX =
          -dragX * POWER;


        velocityY =
          -dragY * POWER;


        launchProjectile();

      }
    );


    /* -----------------------------------------------------
       POINTER CANCEL
    ----------------------------------------------------- */

    projectile.addEventListener(
      "pointercancel",
      () => {

        dragging = false;

        projectile.classList.remove(
          "dragging"
        );

        resetProjectilePosition();

      }
    );

  }


  /* -------------------------------------------------------
     LAUNCH
  ------------------------------------------------------- */

  function launchProjectile() {

    if (
      gameRunning ||
      !projectile ||
      !gameBoard
    ) {
      return;
    }


    gameRunning = true;

    lastTime =
      performance.now();


    const message =
      document.getElementById(
        "gameMessage"
      );


    if (message) {

      message.textContent =
        "پرتاب شد!";

    }


    animationFrame =
      requestAnimationFrame(
        animateProjectile
      );

  }


  /* -------------------------------------------------------
     PHYSICS
  ------------------------------------------------------- */

  function animateProjectile(
    timestamp
  ) {

    if (!gameRunning) {
      return;
    }


    let dt =
      (timestamp - lastTime) /
      1000;


    lastTime =
      timestamp;


    /*
      جلوگیری از جهش هنگام
      افت فریم.
    */

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


    projectile.style.left =
      `${ballX}px`;

    projectile.style.top =
      `${ballY}px`;

    projectile.style.bottom =
      "auto";

    projectile.style.transform =
      "translate(-50%, -50%)";


    /*
      چرخش سنگ در زمان پرواز
    */

    projectile.style.rotate =
      `${timestamp / 4}deg`;


    /*
      برخورد
    */

    const collision =
      checkCollision();


    if (collision) {

      finishShot();

      return;

    }


    /*
      خروج از زمین بازی
    */

    const width =
      gameBoard.clientWidth;

    const height =
      gameBoard.clientHeight;


    if (
      ballX < -80 ||
      ballX > width + 80 ||
      ballY > height + 100 ||
      ballY < -150
    ) {

      finishShot();

      return;

    }


    animationFrame =
      requestAnimationFrame(
        animateProjectile
      );

  }


  /* -------------------------------------------------------
     FINISH SHOT
  ------------------------------------------------------- */

  function finishShot() {

    gameRunning = false;


    if (animationFrame) {

      cancelAnimationFrame(
        animationFrame
      );

      animationFrame = null;

    }


    setTimeout(() => {

      resetProjectilePosition();


      const message =
        document.getElementById(
          "gameMessage"
        );


      if (message) {

        message.textContent =
          "سنگ را بکش و دوباره پرتاب کن";

      }

    }, 350);

  }


  /* -------------------------------------------------------
     RESTART
  ------------------------------------------------------- */

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
    document.getElementById(
      "audioPlayer"
    );

  const musicPlayButton =
    document.getElementById(
      "musicPlayButton"
    );

  const musicProgress =
    document.getElementById(
      "musicProgress"
    );

  const currentTrackTitle =
    document.getElementById(
      "currentTrackTitle"
    );


  function playMusic(
    src,
    title
  ) {

    if (!audioPlayer) {
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


  if (
    musicPlayButton &&
    audioPlayer
  ) {

    musicPlayButton.addEventListener(
      "click",
      () => {

        if (!audioPlayer.src) {
          return;
        }


        if (
          audioPlayer.paused
        ) {

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

        if (!audioPlayer.duration) {
          return;
        }


        const percent =
          (
            audioPlayer.currentTime /
            audioPlayer.duration
          ) * 100;


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


      if (!button) {
        return;
      }


      const item =
        button.closest(
          ".music-item"
        );


      if (!item) {
        return;
      }


      const source =
        item.dataset.src;


      const title =
        item.dataset.title ||
        item.querySelector("h4")
          ?.textContent ||
        "موزیک عشاق";


      if (!source) {
        return;
      }


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
        source,
        title
      );

    }
  );


  /* =======================================================
     MUSIC PROGRESS CLICK
  ======================================================= */

  const progressContainer =
    document.getElementById(
      "musicProgressContainer"
    );


  if (
    progressContainer &&
    audioPlayer
  ) {

    progressContainer.addEventListener(
      "click",
      event => {

        if (!audioPlayer.duration) {
          return;
        }


        const rect =
          progressContainer
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
     ADMIN UPLOAD
  ======================================================= */

  const uploadLinks =
    document.querySelectorAll(
      ".upload-link"
    );


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
     SAVED PLAYER NAME
  ======================================================= */

  const savedName =
    sessionStorage.getItem(
      "oshaghiPlayerName"
    );


  const gamePlayerName =
    document.getElementById(
      "gamePlayerName"
    );


  if (
    savedName &&
    gamePlayerName
  ) {

    gamePlayerName.textContent =
      savedName;

  }


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

});
