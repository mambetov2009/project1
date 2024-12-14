let currentTrack = 0;
let isPlaying = false;
let playlist = [];
const audio = new Audio();

let repeatInfinite = false;
let repeatOnce = false;

function loadFiles(event) {
  const files = Array.from(event.target.files).slice(0, 5);
  if (playlist.length + files.length > 5) {
    showNotification("You can only add up to 5 songs.");
    return;
  }
  playlist = [...playlist, ...files];
  renderPlaylist();
}

function renderPlaylist() {
  const playlistDiv = document.getElementById("playlist");
  playlistDiv.innerHTML = "";
  playlist.forEach((track, index) => {
    const trackElement = document.createElement("div");
    trackElement.className = "track";
    trackElement.innerHTML = `${index + 1}. ${track.name}`;
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "track-buttons";
    const deleteButton = document.createElement("i");
    deleteButton.className = "fas fa-trash";
    deleteButton.onclick = () => deleteTrack(index);
    buttonContainer.appendChild(deleteButton);
    trackElement.appendChild(buttonContainer);
    trackElement.onclick = () => selectTrack(index);
    playlistDiv.appendChild(trackElement);
  });
}

function playPause() {
  if (playlist.length === 0) {
    showNotification("No songs available to play.");
    return;
  }

  if (isPlaying) {
    audio.pause();
    document
      .querySelector("#play-icon")
      .classList.replace("fa-pause", "fa-play");
    showNotification("Paused");
  } else {
    audio.play().catch((error) => {
      console.error("Error playing audio:", error);
    });
    document
      .querySelector("#play-icon")
      .classList.replace("fa-play", "fa-pause");
    showNotification("Playing");
  }
  isPlaying = !isPlaying;
}

function stopPlayback() {
  if (playlist.length === 0) {
    showNotification("No songs available to stop.");
    return;
  }

  audio.pause();
  audio.currentTime = 0;
  document.querySelector("#play-icon").classList.replace("fa-pause", "fa-play");
  showNotification("Stopped");
  isPlaying = false;
}

function selectTrack(trackIndex) {
  if (playlist.length === 0) {
    showNotification("No songs available to play.");
    return;
  }

  currentTrack = trackIndex;
  audio.src = URL.createObjectURL(playlist[currentTrack]);
  audio.load();
  audio
    .play()
    .then(() => {
      isPlaying = true;
      document
        .querySelector("#play-icon")
        .classList.replace("fa-play", "fa-pause");
      updateDuration();
      showNotification(`Playing: ${playlist[currentTrack].name}`);
    })
    .catch((error) => {
      console.error("Error playing audio:", error);
    });
}

function updateDuration() {
  const progressBar = document.getElementById("progress-bar");

  audio.onloadedmetadata = () => {
    document.getElementById("total-duration").textContent = formatTime(
      audio.duration
    );
    progressBar.max = audio.duration;
  };

  audio.ontimeupdate = () => {
    document.getElementById("current-time").textContent = formatTime(
      audio.currentTime
    );
    progressBar.value = audio.currentTime;
  };
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" + secs : secs}`;
}

function seekAudio() {
  audio.currentTime = document.getElementById("progress-bar").value;
}

function nextTrack() {
  currentTrack = (currentTrack + 1) % playlist.length;
  selectTrack(currentTrack);
}

function prevTrack() {
  currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
  selectTrack(currentTrack);
}

function changeVolume() {
  audio.volume = document.getElementById("volume").value;
  document.getElementById("volume-display").innerText = `${Math.floor(
    audio.volume * 100
  )}%`;
}

function changeSpeed() {
  audio.playbackRate = document.getElementById("speed").value;
  document.getElementById("speed-display").innerText = `${audio.playbackRate}x`;
}

function showNotification(message) {
  const notification = document.getElementById("notification");
  const notificationText = document.getElementById("notification-text");
  notificationText.innerText = message;
  notification.style.display = "flex";
  setTimeout(() => {
    notification.style.display = "none";
  }, 3000);
}

function hideNotification() {
  document.getElementById("notification").style.display = "none";
}

function deleteTrack(index) {
  playlist.splice(index, 1);
  renderPlaylist();
  showNotification("Track deleted");
}

function toggleRepeatInfinite() {
  repeatInfinite = !repeatInfinite;
  repeatOnce = false; // Desactiva repetición única
  updateRepeatButtons();
  showNotification(
    repeatInfinite ? "Repeat All Enabled" : "Repeat All Disabled"
  );
}

function toggleRepeatOnce() {
  repeatOnce = !repeatOnce;
  repeatInfinite = false; // Desactiva repetición infinita
  updateRepeatButtons();
  showNotification(repeatOnce ? "Repeat One Enabled" : "Repeat One Disabled");
}

function updateRepeatButtons() {
  const repeatInfiniteBtn = document.getElementById("repeat-infinite-btn");
  const repeatOnceBtn = document.getElementById("repeat-once-btn");

  repeatInfiniteBtn.style.color = repeatInfinite ? "#ff9eed" : "";
  repeatOnceBtn.style.color = repeatOnce ? "#ff9eed" : "";
}

audio.onended = () => {
  if (repeatOnce) {
    selectTrack(currentTrack); // Repite la misma canción
  } else if (repeatInfinite) {
    nextTrack(); // Pasa a la siguiente canción en modo infinito
  } else if (currentTrack < playlist.length - 1) {
    nextTrack();
  } else {
    stopPlayback();
  }
};
