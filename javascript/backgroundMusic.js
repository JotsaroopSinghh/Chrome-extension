document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.getElementById("toggle");
  const audioElement = document.getElementById("audio");
  const trackList = document.querySelectorAll(".track-list li");
  const warningMessage = document.getElementById("warning");
  const coverArt = document.getElementById("cover-art");
  const coverArtText = document.querySelector(".cover-art-text");

  let isPlaying = false;
  let currentAudio = null;

  // Load state from localStorage
  const savedAudioSrc = localStorage.getItem("currentAudio");
  const savedCurrentTime = parseFloat(localStorage.getItem("currentTime") || "0");

  if (savedAudioSrc) {
    audioElement.src = savedAudioSrc;
    currentAudio = savedAudioSrc;
    audioElement.currentTime = savedCurrentTime;

    // Highlight the currently playing track
    trackList.forEach((track) => {
      if (track.getAttribute("data-audio") === savedAudioSrc) {
        track.classList.add("playing");

        const coverSrc = track.getAttribute("data-cover");
        coverArt.style.backgroundImage = `url('${coverSrc}')`;
        coverArt.textContent = ""; // Clear default icon
        coverArtText.style.display = "none"; // Hide default text
      }
    });

    warningMessage.style.display = "none"; // Hide warning message
    toggleButton.disabled = false; // Enable toggle button
    toggleButton.textContent = "▶"; // Show play icon
  }

  toggleButton.addEventListener("click", () => {
    if (isPlaying) {
      audioElement.pause();
      toggleButton.textContent = "▶"; // Show play icon
    } else {
      audioElement.play();
      toggleButton.textContent = "||"; // Show pause icon
    }
    isPlaying = !isPlaying;

    // Save state to localStorage
    localStorage.setItem("isPlaying", isPlaying);
  });

  audioElement.addEventListener("timeupdate", () => {
    // Save the current time to localStorage
    localStorage.setItem("currentTime", audioElement.currentTime);
  });

  trackList.forEach((track) => {
    track.addEventListener("click", () => {
      const audioSrc = track.getAttribute("data-audio");
      const coverSrc = track.getAttribute("data-cover");
      audioElement.src = audioSrc;
      currentAudio = audioSrc;
      audioElement.currentTime = 0; // Reset time to 0 when a new track is selected
      audioElement.play();
      isPlaying = true;
      toggleButton.textContent = "||"; // Show pause icon
      toggleButton.disabled = false;

      // Highlight the currently playing track
      trackList.forEach((item) => {
        if (item === track) {
          item.classList.add("playing");
        } else {
          item.classList.remove("playing");
        }
      });

      // Show warning message if a track is selected
      warningMessage.style.display = "none";

      // Set cover art
      coverArt.style.backgroundImage = `url('${coverSrc}')`;
      coverArt.textContent = ""; // Clear default icon
      coverArtText.style.display = "none"; // Hide default text

      // Save state to localStorage
      localStorage.setItem("currentAudio", currentAudio);
      localStorage.setItem("currentTime", audioElement.currentTime);
    });
  });

  // Show default cover art when no track is selected
  toggleButton.addEventListener("click", () => {
    if (!currentAudio) {
      coverArt.textContent = "🎵"; // Show default icon
      coverArtText.style.display = "block"; // Show default text
    }
  });

  // Show warning message if no track is selected
  toggleButton.addEventListener("click", () => {
    if (!currentAudio) {
      warningMessage.style.display = "block";
    } else {
      warningMessage.style.display = "none";
    }
  });
});
