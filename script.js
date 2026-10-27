const today = new Date();
today.setHours(0, 0, 0, 0);

const performanceDate = new Date(2026, 7, 8);
const millisecondsPerDay = 1000 * 60 * 60 * 24;
const daysUntilPerformance = Math.floor((performanceDate - today) / millisecondsPerDay);
const countdown = document.getElementById("倒數");

if (countdown) {
  countdown.textContent = daysUntilPerformance >= 0
    ? `還有 ${daysUntilPerformance} 天 · 2026.08.08`
    : `2026.08.08 演出已於 ${Math.abs(daysUntilPerformance)} 天前登場`;
}

const previewVideo = document.getElementById("preview-media");
const playButton = document.getElementById("play-button");
const playIcon = document.querySelector(".play-icon");
const player = document.querySelector(".player");
const playerStatus = document.getElementById("player-status");
const playerTime = document.getElementById("player-time");
const seekControl = document.getElementById("player-seek");
const volumeControl = document.getElementById("volume");

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) {
    return "--:--";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

function updateProgress() {
  const duration = previewVideo.duration;
  const currentTime = previewVideo.currentTime;

  playerTime.textContent = `${formatTime(currentTime)} / ${formatTime(duration)}`;
  seekControl.value = Number.isFinite(duration) && duration > 0
    ? String(Math.round((currentTime / duration) * Number(seekControl.max)))
    : "0";
}

playButton.addEventListener("click", () => {
  if (previewVideo.paused) {
    previewVideo.play().catch((error) => {
      playerStatus.textContent = "無法播放影片，請確認檔案格式或瀏覽器支援";
      console.error("Unable to play the preview video.", error);
    });
  } else {
    previewVideo.pause();
  }
});

previewVideo.addEventListener("play", () => {
  player.classList.add("is-playing");
  playIcon.textContent = "❚❚";
  playButton.setAttribute("aria-label", "暫停試聽");
  playButton.setAttribute("aria-pressed", "true");
  playerStatus.textContent = "正在播放 Sound of the Fuse";
});

previewVideo.addEventListener("pause", () => {
  player.classList.remove("is-playing");
  playIcon.textContent = "▶";
  playButton.setAttribute("aria-label", "繼續試聽");
  playButton.setAttribute("aria-pressed", "false");
  if (!previewVideo.ended) {
    playerStatus.textContent = "已暫停 · 按下繼續播放";
  }
});

previewVideo.addEventListener("ended", () => {
  playerStatus.textContent = "試聽結束 · 按下重新播放";
  updateProgress();
});

previewVideo.addEventListener("loadedmetadata", updateProgress);
previewVideo.addEventListener("timeupdate", updateProgress);
previewVideo.addEventListener("error", () => {
  playerStatus.textContent = "影片載入失敗，請確認 video 資料夾中的媒體檔";
  console.error("Unable to load video/Sound_of_the_Fuse.mp4.", previewVideo.error);
});

seekControl.addEventListener("input", () => {
  if (Number.isFinite(previewVideo.duration) && previewVideo.duration > 0) {
    previewVideo.currentTime = (Number(seekControl.value) / Number(seekControl.max)) * previewVideo.duration;
  }
});

volumeControl.addEventListener("input", () => {
  previewVideo.volume = Number(volumeControl.value);
});

previewVideo.volume = Number(volumeControl.value);
