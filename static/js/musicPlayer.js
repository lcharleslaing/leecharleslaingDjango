(function() {
  const player = document.getElementById('music-player');
  const full = document.getElementById('fullscreen-player');
  if (!player || !full) return;

  const audio = new Audio();
  const playlist = window.musicPlaylist || [];
  let index = 0;
  let isPlaying = false;

  // Elements
  const progressBars = player.querySelectorAll('.progress-container');
  const progressEls = player.querySelectorAll('.progress');
  const timeCurrentEls = player.querySelectorAll('[data-current-time]');
  const timeDurationEls = player.querySelectorAll('[data-duration]');
  const titleEls = document.querySelectorAll('#music-player [data-title], #fullscreen-player [data-title]');
  const artistEls = document.querySelectorAll('#music-player [data-artist], #fullscreen-player [data-artist]');
  const coverImg = full.querySelector('[data-cover]');
  const playButtons = document.querySelectorAll('[data-action="togglePlay"]');
  const prevButtons = document.querySelectorAll('[data-action="prev"]');
  const nextButtons = document.querySelectorAll('[data-action="next"]');

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return m + ':' + s;
  }

  function updateProgress() {
    const percent = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
    progressEls.forEach(el => { el.style.width = percent + '%'; });
    timeCurrentEls.forEach(el => { el.textContent = formatTime(audio.currentTime || 0); });
  }

  function updateDuration() {
    timeDurationEls.forEach(el => { el.textContent = formatTime(audio.duration || 0); });
  }

  function loadSong(i) {
    if (!playlist.length) return;
    index = (i + playlist.length) % playlist.length;
    const song = playlist[index];
    audio.src = song.url;
    audio.load();
    titleEls.forEach(el => { el.textContent = song.title; });
    artistEls.forEach(el => { el.textContent = song.artist; });
    if (coverImg) coverImg.src = song.cover || '';
    if (isPlaying) audio.play();
  }

  function togglePlay() {
    if (audio.paused) { audio.play(); } else { audio.pause(); }
  }

  function prevSong() { loadSong(index - 1); }
  function nextSong() { loadSong(index + 1); }

  function handleSeek(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pos * (audio.duration || 0);
  }

  progressBars.forEach(bar => {
    bar.addEventListener('click', handleSeek);
  });

  playButtons.forEach(btn => btn.addEventListener('click', togglePlay));
  prevButtons.forEach(btn => btn.addEventListener('click', prevSong));
  nextButtons.forEach(btn => btn.addEventListener('click', nextSong));

  document.querySelectorAll('[data-action="openFull"]').forEach(btn => {
    btn.addEventListener('click', () => full.classList.remove('hidden'));
  });
  document.querySelectorAll('[data-action="closeFull"]').forEach(btn => {
    btn.addEventListener('click', () => full.classList.add('hidden'));
  });

  audio.addEventListener('timeupdate', updateProgress);
  audio.addEventListener('loadedmetadata', () => {
    updateDuration();
    updateProgress();
  });
  audio.addEventListener('play', () => {
    isPlaying = true;
    playButtons.forEach(btn => btn.innerHTML = '<i class="fa-solid fa-pause' + (btn.classList.contains('btn-lg') ? ' text-2xl' : '') + '"></i>');
  });
  audio.addEventListener('pause', () => {
    isPlaying = false;
    playButtons.forEach(btn => btn.innerHTML = '<i class="fa-solid fa-play' + (btn.classList.contains('btn-lg') ? ' text-2xl' : '') + '"></i>');
  });
  audio.addEventListener('ended', nextSong);

  // init
  if (playlist.length) {
    player.classList.remove('hidden');
    loadSong(index);
  }
})();
