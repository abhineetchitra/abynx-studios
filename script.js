const tracks = [
  {
    title: 'BAKSH DO',
    artist: 'Abynx • Single',
    duration: '1:31',
    cover: "Images/Bakshdo.jpg",
    src: "Audios/BAKSHDOmastered2.wav"
  },
  {
    title: 'Sometimes You Still Lose',
    artist: 'Abynx, Rayz0r',
    duration: '2:44',
    cover: 'Images/SometimesYouStillLose.jpg',
    src: 'Audios/SometimesYouStillLose.wav'
  },
  {
    title: 'Sahar',
    artist: 'Abynx • Single',
    duration: '2:11',
    cover: 'Images/sahar.jpg',
    src: 'Audios/Sahar.flac'
  }
  ,
  {
    title: 'Kabhi Alvida Na Kehna',
    artist: 'Abynx • Single',
    duration: '2:24',
    cover: 'Images/Kabhi Alvida Na Kehna .jpg',
    src: 'Audios/Kabhi Alvida Na Kehna (mastered).wav'
  }
  ,
  {
    title: "eyes don't lie",
    artist: 'Abynx • Single',
    duration: '1:20',
    cover: "Images/eyes don't lie.png",
    src: "Audios/eyes don't lie.wav"
  }
  ,
  {
    title: 'WordShot',
    artist: 'Abynx • Single',
    duration: '1:52',
    cover: 'Images/WordShot.jpg',
    src: 'Audios/WordShotmastered.wav'
  }
  ,
  {
    title: 'Khandani Khoobsurati',
    artist: 'Abynx • Single',
    duration: '1:59',
    cover: 'Images/Khandani Khoobsurati.jpg',
    src: 'Audios/Khandani Khoobsurati.mp3'
  }
];

const audio = document.getElementById('audio');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progress = document.getElementById('progress');
const volume = document.getElementById('volume');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const nowTitle = document.getElementById('nowTitle');
const nowArtist = document.getElementById('nowArtist');
const nowCover = document.getElementById('nowCover');
const themeToggle = document.querySelector('[data-theme-toggle]');
const form = document.getElementById('contactForm');

let currentTrack = 0;

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}

function updateRangeBackground(input, valuePercent) {
  if (input) input.style.setProperty('--progress', `${valuePercent}%`);
}

function loadTrack(index) {
  currentTrack = index;
  const track = tracks[index];
  audio.src = track.src;
  nowTitle.textContent = track.title;
  nowArtist.textContent = track.artist;
  nowCover.src = track.cover;
  nowCover.alt = `${track.title} cover art`;

  if (durationEl) durationEl.textContent = track.duration;
  if (progress) progress.value = 0;
  if (currentTimeEl) currentTimeEl.textContent = '0:00';
  updateRangeBackground(progress, 0);
}

async function togglePlay() {
  if (!audio.src) loadTrack(currentTrack);

  if (audio.paused) {
    try {
      await audio.play();
      playBtn.textContent = '❚❚';
    } catch (e) {
      playBtn.textContent = '▶';
    }
  } else {
    audio.pause();
    playBtn.textContent = '▶';
  }
}

function playSpecific(index) {
  loadTrack(index);
  audio.play()
    .then(() => {
      playBtn.textContent = '❚❚';
    })
    .catch(() => {
      playBtn.textContent = '▶';
    });
}

if (playBtn) playBtn.addEventListener('click', togglePlay);
if (prevBtn) prevBtn.addEventListener('click', () => playSpecific((currentTrack - 1 + tracks.length) % tracks.length));
if (nextBtn) nextBtn.addEventListener('click', () => playSpecific((currentTrack + 1) % tracks.length));

document.querySelectorAll('[data-play-track]').forEach(btn => {
  btn.addEventListener('click', () => playSpecific(Number(btn.dataset.playTrack)));
});

if (audio) {
  audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;
    const percent = (audio.currentTime / audio.duration) * 100;
    if (progress) progress.value = percent;
    if (currentTimeEl) currentTimeEl.textContent = formatTime(audio.currentTime);
    if (durationEl) durationEl.textContent = formatTime(audio.duration);
    updateRangeBackground(progress, percent);
  });

  audio.addEventListener('ended', () => {
    playSpecific((currentTrack + 1) % tracks.length);
  });

  audio.addEventListener('loadedmetadata', () => {
    if (durationEl) durationEl.textContent = formatTime(audio.duration);
  });

  audio.volume = 0.8;
  loadTrack(0);
}

if (progress) {
  progress.addEventListener('input', () => {
    if (!audio.duration) return;
    audio.currentTime = (progress.value / 100) * audio.duration;
    updateRangeBackground(progress, progress.value);
  });
}

if (volume) {
  volume.addEventListener('input', () => {
    audio.volume = volume.value;
    updateRangeBackground(volume, volume.value * 100);
  });
  updateRangeBackground(volume, 80);
}

// if (themeToggle) {
//   themeToggle.addEventListener('click', () => {
//     const root = document.documentElement;
//     const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
//     root.setAttribute('data-theme', next);
//     themeToggle.innerHTML = next === 'dark'
//       ? '<span aria-hidden="true">☼</span>'
//       : '<span aria-hidden="true">☾</span>';
//   });
// }

if (form) {
  const formStatus = document.getElementById('formStatus');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = form.name.value.trim();
    formStatus.textContent = name
      ? `Thanks, ${name}. Your inquiry is ready to be connected to a backend or email service.`
      : 'Your inquiry is ready to be connected to a backend or email service.';
    form.reset();
  });
}