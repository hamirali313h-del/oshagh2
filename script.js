/* =========================================
   OSHAGH - MAIN SCRIPT
========================================= */

/* ---------- Navigation ---------- */

const navLinks = document.querySelectorAll(".nav a");

navLinks.forEach(link => {
  link.addEventListener("click", () => {
    navLinks.forEach(item => item.classList.remove("active"));
    link.classList.add("active");
  });
});


/* =========================================
   GAME LOGIN
========================================= */

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
  gameModal.setAttribute("aria-hidden", "false");

  setTimeout(() => {
    if (playerNameInput) {
      playerNameInput.focus();
    }
  }, 150);
}


function closeGameModal() {

  if (!gameModal) return;

  gameModal.classList.remove("show");
  gameModal.setAttribute("aria-hidden", "true");

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


/* ---------- Game Login ---------- */

if (enterGameBtn) {

  enterGameBtn.addEventListener("click", () => {

    const name = playerNameInput.value.trim();
    const word = secretWordInput.value.trim();

    if (!name) {

      loginError.textContent =
        "لطفاً نام خود را وارد کنید.";

      playerNameInput.focus();

      return;
    }


    if (word !== "یاریکون") {

      loginError.textContent =
        "عبارت واردشده درست نیست.";

      secretWordInput.focus();

      return;
    }


    /*
      فعلاً نام فقط برای همین نشست نگه داشته می‌شود.
      هیچ حساب کاربری ساخته نمی‌شود.
    */

    sessionStorage.setItem(
      "oshaghiPlayerName",
      name
    );


    closeGameModal();


    /*
      وقتی فایل بازی واقعی را اضافه کنیم،
      اینجا بازی باز خواهد شد.
    */

    openGame();

  });

}


/* ---------- Game ---------- */

function openGame() {

  /*
    فعلاً پیام موقت است.
    در مرحله بعد موتور کامل «رمی جقرات»
    اینجا قرار می‌گیرد.
  */

  alert(
    `خوش آمدی ${sessionStorage.getItem("oshaghiPlayerName")}!\n\n` +
    "بازی رمی جقرات آماده ساخت است."
  );

}


/* =========================================
   MUSIC PLAYER
========================================= */

const audioPlayer =
  document.getElementById("audioPlayer");

const playMusicBtn =
  document.getElementById("playMusic");

const prevTrackBtn =
  document.getElementById("prevTrack");

const nextTrackBtn =
  document.getElementById("nextTrack");

const playerTitle =
  document.getElementById("playerTitle");

const playerCover =
  document.getElementById("playerCover");

const playerProgress =
  document.getElementById("playerProgress");

const currentTimeElement =
  document.getElementById("currentTime");

const durationElement =
  document.getElementById("duration");


let musicTracks = [];

let currentTrackIndex = 0;


/* ---------- Format Time ---------- */

function formatTime(seconds) {

  if (!Number.isFinite(seconds)) {
    return "00:00";
  }

  const minutes =
    Math.floor(seconds / 60);

  const remainingSeconds =
    Math.floor(seconds % 60);

  return (
    String(minutes).padStart(2, "0") +
    ":" +
    String(remainingSeconds).padStart(2, "0")
  );

}


/* ---------- Load Track ---------- */

function loadTrack(index, autoplay = false) {

  if (!musicTracks.length) {
    return;
  }

  currentTrackIndex = index;

  const track =
    musicTracks[currentTrackIndex];

  if (!track) {
    return;
  }


  if (audioPlayer) {
    audioPlayer.src = track.url;
    audioPlayer.load();
  }


  if (playerTitle) {
    playerTitle.textContent =
      track.title || "بدون عنوان";
  }


  if (playerCover) {
    playerCover.src =
      track.cover || "logo.png";
  }


  if (playerProgress) {
    playerProgress.style.width = "0%";
  }


  if (currentTimeElement) {
    currentTimeElement.textContent = "00:00";
  }


  if (durationElement) {
    durationElement.textContent = "00:00";
  }


  document
    .querySelectorAll(".music-item")
    .forEach(item => {

      item.classList.remove("active");

    });


  const activeItem =
    document.querySelector(
      `.music-item[data-index="${index}"]`
    );


  if (activeItem) {
    activeItem.classList.add("active");
  }


  if (autoplay && audioPlayer) {

    audioPlayer
      .play()
      .catch(() => {});

  }

}


/* ---------- Play / Pause ---------- */

if (playMusicBtn) {

  playMusicBtn.addEventListener("click", () => {

    if (!audioPlayer || !musicTracks.length) {
      return;
    }


    if (audioPlayer.paused) {

      audioPlayer
        .play()
        .catch(() => {});

    } else {

      audioPlayer.pause();

    }

  });

}


/* ---------- Audio Events ---------- */

if (audioPlayer) {

  audioPlayer.addEventListener("play", () => {

    if (playMusicBtn) {
      playMusicBtn.textContent = "Ⅱ";
    }

  });


  audioPlayer.addEventListener("pause", () => {

    if (playMusicBtn) {
      playMusicBtn.textContent = "▶";
    }

  });


  audioPlayer.addEventListener("timeupdate", () => {

    if (!audioPlayer.duration) {
      return;
    }


    const percentage =
      (audioPlayer.currentTime /
        audioPlayer.duration) * 100;


    if (playerProgress) {
      playerProgress.style.width =
        percentage + "%";
    }


    if (currentTimeElement) {
      currentTimeElement.textContent =
        formatTime(audioPlayer.currentTime);
    }

  });


  audioPlayer.addEventListener("loadedmetadata", () => {

    if (durationElement) {

      durationElement.textContent =
        formatTime(audioPlayer.duration);

    }

  });


  audioPlayer.addEventListener("ended", () => {

    if (!musicTracks.length) {
      return;
    }


    let next =
      currentTrackIndex + 1;


    if (next >= musicTracks.length) {
      next = 0;
    }


    loadTrack(next, true);

  });

}


/* ---------- Previous ---------- */

if (prevTrackBtn) {

  prevTrackBtn.addEventListener("click", () => {

    if (!musicTracks.length) {
      return;
    }


    let previous =
      currentTrackIndex - 1;


    if (previous < 0) {
      previous = musicTracks.length - 1;
    }


    loadTrack(previous, true);

  });

}


/* ---------- Next ---------- */

if (nextTrackBtn) {

  nextTrackBtn.addEventListener("click", () => {

    if (!musicTracks.length) {
      return;
    }


    let next =
      currentTrackIndex + 1;


    if (next >= musicTracks.length) {
      next = 0;
    }


    loadTrack(next, true);

  });

}


/* ---------- Progress Click ---------- */

const progressContainer =
  document.querySelector(".player-progress");


if (progressContainer) {

  progressContainer.addEventListener("click", event => {

    if (
      !audioPlayer ||
      !audioPlayer.duration
    ) {
      return;
    }


    const rect =
      progressContainer.getBoundingClientRect();


    const percent =
      (event.clientX - rect.left) /
      rect.width;


    audioPlayer.currentTime =
      audioPlayer.duration *
      Math.max(0, Math.min(1, percent));

  });

}


/* =========================================
   MUSIC LIST
========================================= */

function renderMusicList(tracks) {

  const musicList =
    document.getElementById("musicList");


  if (!musicList) {
    return;
  }


  musicList.innerHTML = "";


  if (!tracks.length) {

    musicList.innerHTML = `

      <div class="music-empty">

        <div class="music-empty-icon">
          ♪
        </div>

        <h3>آرشیو موسیقی</h3>

        <p>
          هنوز آهنگی اضافه نشده است.
        </p>

      </div>

    `;

    return;
  }


  tracks.forEach((track, index) => {

    const item =
      document.createElement("div");


    item.className = "music-item";

    item.dataset.index = index;


    item.innerHTML = `

      <img
        class="music-cover"
        src="${track.cover || "logo.png"}"
        alt="کاور"
      >

      <div class="music-info">

        <h3>
          ${escapeHTML(track.title || "بدون عنوان")}
        </h3>

        <span>
          ${escapeHTML(track.artist || "عشاق")}
        </span>

      </div>

      <div class="music-actions">

        <button
          class="music-play"
          type="button"
          aria-label="پخش"
        >
          ▶
        </button>

        ${
          track.url
            ? `
              <a
                class="music-download"
                href="${track.url}"
                download
                title="دانلود"
              >
                ↓
              </a>
            `
            : ""
        }

      </div>

    `;


    const playButton =
      item.querySelector(".music-play");


    playButton.addEventListener(
      "click",
      event => {

        event.stopPropagation();

        loadTrack(index, true);

      }
    );


    item.addEventListener("click", () => {

      loadTrack(index, true);

    });


    musicList.appendChild(item);

  });

}


/* =========================================
   POSTS
========================================= */

function renderPosts(posts) {

  const container =
    document.getElementById("postsContainer");


  if (!container) {
    return;
  }


  container.innerHTML = "";


  if (!posts.length) {

    container.innerHTML = `

      <article class="post-card empty-card">

        <div class="empty-icon">
          ع
        </div>

        <div>

          <h3>
            هنوز مطلبی منتشر نشده
          </h3>

          <p>
            مطالب جدید از این بخش نمایش داده خواهند شد.
          </p>

        </div>

      </article>

    `;

    return;
  }


  posts.forEach(post => {

    const article =
      document.createElement("article");


    article.className = "post-card";


    let media = "";


    if (post.media_url) {

      if (post.media_type === "video") {

        media = `

          <div class="post-media">

            <video
              controls
              preload="metadata"
              src="${post.media_url}"
            ></video>

          </div>

        `;

      } else {

        media = `

          <div class="post-media">

            <img
              src="${post.media_url}"
              alt="${escapeHTML(post.title || "مطلب عشاق")}"
              loading="lazy"
            >

          </div>

        `;

      }

    }


    article.innerHTML = `

      ${media}

      <div class="post-content">

        <div class="post-meta">

          <span>
            خبرگزاری عشاق
          </span>

          <span>
            ${formatDate(post.created_at)}
          </span>

        </div>

        <h3>
          ${escapeHTML(post.title || "بدون عنوان")}
        </h3>

        <p>
          ${escapeHTML(post.content || "")}
        </p>

      </div>

    `;


    container.appendChild(article);

  });

}


/* =========================================
   HELPERS
========================================= */

function escapeHTML(value) {

  if (value === null || value === undefined) {
    return "";
  }


  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


function formatDate(dateString) {

  if (!dateString) {
    return "";
  }


  const date =
    new Date(dateString);


  if (Number.isNaN(date.getTime())) {
    return "";
  }


  return new Intl.DateTimeFormat(
    "fa-IR",
    {
      year: "numeric",
      month: "short",
      day: "numeric"
    }
  ).format(date);

}


/* =========================================
   TEMPORARY DATA
========================================= */

/*
  فعلاً این آرایه‌ها خالی هستند.

  در مرحله اتصال Supabase،
  اطلاعات واقعی از دیتابیس خوانده می‌شوند.
*/

musicTracks = [];

renderMusicList(musicTracks);

renderPosts([]);


/* =========================================
   SUPABASE
========================================= */

/*
  اتصال واقعی Supabase را در مرحله بعد
  اضافه می‌کنیم.

  فعلاً این قسمت را دست نمی‌زنیم.
*/


console.log("Oshagh website loaded successfully.");
