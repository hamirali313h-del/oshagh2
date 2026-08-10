const modal=document.getElementById("gameModal");
const play=document.getElementById("playGameBtn");
const close=document.getElementById("closeGame");
const enter=document.getElementById("enterGame");
const nameInput=document.getElementById("playerName");
const wordInput=document.getElementById("secretWord");
const error=document.getElementById("loginError");

function openModal(){modal.classList.add("show");setTimeout(()=>nameInput.focus(),100)}
function closeModal(){modal.classList.remove("show");error.textContent=""}
play.onclick=openModal;close.onclick=closeModal;
modal.addEventListener("click",e=>{if(e.target===modal)closeModal()});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal()});

enter.onclick=()=>{
  const name=nameInput.value.trim();
  const word=wordInput.value.trim();
  if(!name){error.textContent="لطفاً نام خود را وارد کنید.";return}
  if(word!=="یاریکون"){error.textContent="عبارت واردشده درست نیست.";return}
  sessionStorage.setItem("oshaghiPlayerName",name);
  closeModal();
  alert(`خوش آمدی ${name}!\nبازی «رمی جقرات» در مرحله بعد اضافه می‌شود.`);
};

const music=document.getElementById("musicPlay");
const bar=document.getElementById("progressBar");
let playing=false,timer;
music.onclick=()=>{
  playing=!playing;music.textContent=playing?"Ⅱ":"▶";clearInterval(timer);
  if(playing){
    let p=0;
    timer=setInterval(()=>{p++;bar.style.width=p+"%";if(p>=100){clearInterval(timer);playing=false;music.textContent="▶"}},120);
  }
};
