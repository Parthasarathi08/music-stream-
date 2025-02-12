// Sample music data (in a real application, this would come from a backend API)
const musicLibrary = [
    {
        id: 1,
        title: "Summer Vibes",
        artist: "The Groove",
        genre: "pop",
        artwork: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300",
        audioSrc: "assets/audio/track1.mp3"
    },
    {
        id: 2,
        title: "Electric Dreams",
        artist: "Synthwave",
        genre: "electronic",
        artwork: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300",
        audioSrc: "assets/audio/track2.mp3"
    },
    {
        id: 3,
        title: "Midnight Jazz",
        artist: "The Cool Cats",
        genre: "jazz",
        artwork: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=300",
        audioSrc: "assets/audio/track3.mp3"
    },
    {
        id: 4,
        title: "Rock Anthem",
        artist: "Stone Breakers",
        genre: "rock",
        artwork: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=300",
        audioSrc: "assets/audio/track4.mp3"
    },
    // Add more tracks as needed
];

// Player State
let currentTrack = null;
let isPlaying = false;
let currentPlaylist = [];
let shuffle = false;
let repeat = false;

// DOM Elements
const audioPlayer = new Audio();
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const shuffleBtn = document.getElementById('shuffle-btn');
const repeatBtn = document.getElementById('repeat-btn');
const volumeSlider = document.getElementById('volume-slider');
const progressBar = document.querySelector('.progress');
const currentTimeSpan = document.getElementById('current-time');
const durationSpan = document.getElementById('duration');
const trackArtwork = document.getElementById('track-artwork');
const trackTitle = document.getElementById('track-title');
const trackArtist = document.getElementById('track-artist');
const searchInput = document.getElementById('search-input');
const genreSelect = document.getElementById('genre-select');
const featuredTracks = document.getElementById('featured-tracks');
const libraryTracks = document.getElementById('library-tracks');

// Initialize the application
function init() {
    loadFeaturedTracks();
    loadLibraryTracks();
    setupEventListeners();
}

// Load featured tracks
function loadFeaturedTracks() {
    const featured = musicLibrary.slice(0, 4); // Show first 4 tracks as featured
    featuredTracks.innerHTML = featured.map(track => createTrackCard(track)).join('');
}

// Load library tracks
function loadLibraryTracks(filters = {}) {
    let filteredTracks = [...musicLibrary];

    // Apply search filter
    if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredTracks = filteredTracks.filter(track => 
            track.title.toLowerCase().includes(searchTerm) ||
            track.artist.toLowerCase().includes(searchTerm)
        );
    }

    // Apply genre filter
    if (filters.genre && filters.genre !== 'all') {
        filteredTracks = filteredTracks.filter(track => 
            track.genre === filters.genre
        );
    }

    libraryTracks.innerHTML = filteredTracks.map(track => createTrackCard(track)).join('');
}

// Create track card HTML
function createTrackCard(track) {
    return `
        <div class="track-card" data-track-id="${track.id}">
            <img src="${track.artwork}" alt="${track.title}">
            <div class="track-info">
                <h3>${track.title}</h3>
                <p>${track.artist}</p>
            </div>
        </div>
    `;
}

// Setup event listeners
function setupEventListeners() {
    // Player controls
    playBtn.addEventListener('click', togglePlay);
    prevBtn.addEventListener('click', playPrevious);
    nextBtn.addEventListener('click', playNext);
    shuffleBtn.addEventListener('click', toggleShuffle);
    repeatBtn.addEventListener('click', toggleRepeat);
    volumeSlider.addEventListener('input', updateVolume);

    // Track progress
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('loadedmetadata', updateDuration);
    document.querySelector('.progress-bar').addEventListener('click', seek);

    // Library filters
    searchInput.addEventListener('input', handleSearch);
    genreSelect.addEventListener('change', handleGenreFilter);

    // Track selection
    document.addEventListener('click', e => {
        const trackCard = e.target.closest('.track-card');
        if (trackCard) {
            const trackId = parseInt(trackCard.dataset.trackId);
            const track = musicLibrary.find(t => t.id === trackId);
            if (track) playTrack(track);
        }
    });

    // Contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
}

// Player functions
function playTrack(track) {
    currentTrack = track;
    audioPlayer.src = track.audioSrc;
    audioPlayer.play();
    isPlaying = true;
    updatePlayerUI();
}

function togglePlay() {
    if (!currentTrack) {
        if (musicLibrary.length > 0) {
            playTrack(musicLibrary[0]);
        }
        return;
    }

    if (isPlaying) {
        audioPlayer.pause();
    } else {
        audioPlayer.play();
    }
    isPlaying = !isPlaying;
    updatePlayerUI();
}

function playPrevious() {
    if (!currentTrack) return;
    const currentIndex = currentPlaylist.indexOf(currentTrack);
    const prevIndex = (currentIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
    playTrack(currentPlaylist[prevIndex]);
}

function playNext() {
    if (!currentTrack) return;
    const currentIndex = currentPlaylist.indexOf(currentTrack);
    const nextIndex = (currentIndex + 1) % currentPlaylist.length;
    playTrack(currentPlaylist[nextIndex]);
}

function toggleShuffle() {
    shuffle = !shuffle;
    shuffleBtn.classList.toggle('active');
    updatePlaylist();
}

function toggleRepeat() {
    repeat = !repeat;
    repeatBtn.classList.toggle('active');
    audioPlayer.loop = repeat;
}

function updateVolume() {
    audioPlayer.volume = volumeSlider.value / 100;
}

function updateProgress() {
    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressBar.style.width = `${progress}%`;
    currentTimeSpan.textContent = formatTime(audioPlayer.currentTime);
}

function updateDuration() {
    durationSpan.textContent = formatTime(audioPlayer.duration);
}

function seek(e) {
    const progressBar = e.currentTarget;
    const clickPosition = e.offsetX / progressBar.offsetWidth;
    audioPlayer.currentTime = clickPosition * audioPlayer.duration;
}

// UI update functions
function updatePlayerUI() {
    if (!currentTrack) return;

    trackArtwork.src = currentTrack.artwork;
    trackTitle.textContent = currentTrack.title;
    trackArtist.textContent = currentTrack.artist;
    playBtn.innerHTML = isPlaying ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
}

function updatePlaylist() {
    currentPlaylist = shuffle ? shuffleArray([...musicLibrary]) : [...musicLibrary];
}

// Filter functions
function handleSearch() {
    loadLibraryTracks({ 
        search: searchInput.value,
        genre: genreSelect.value
    });
}

function handleGenreFilter() {
    loadLibraryTracks({
        search: searchInput.value,
        genre: genreSelect.value
    });
}

// Utility functions
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Contact form handler
function handleContactSubmit(e) {
    e.preventDefault();
    const formData = {
        name: e.target.name.value,
        email: e.target.email.value,
        message: e.target.message.value
    };
    
    // In a real application, you would send this data to a backend server
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    e.target.reset();
}

// Initialize the application
init();
