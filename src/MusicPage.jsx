import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";
import SongCard from "./SongCard";

// 🎵 Local song imports
import song1 from "./assets/song1.mp3";
import song2 from "./assets/song2.mp3";
import song3 from "./assets/song3.mp3";
import song4 from "./assets/song4.mp3";
import song5 from "./assets/song5.mp3";
import song6 from "./assets/song6.mp3";
import song7 from "./assets/song7.mp3";
import song8 from "./assets/song8.mp3";
import song9 from "./assets/song9.mp3";
import song10 from "./assets/song10.mp3";

// 🎵 Local cover imports
import cover1 from "./assets/121.jpg";
import cover2 from "./assets/122.jpeg";
import cover3 from "./assets/123.jpg";
import cover4 from "./assets/124.webp";
import cover5 from "./assets/125.webp";
import cover6 from "./assets/126.jpg";
import cover7 from "./assets/127.jpg";
import cover8 from "./assets/128.webp";
import cover9 from "./assets/129.jpg";
import cover10 from "./assets/130.jpg";

export default function MusicPage() {
  const songs = [
    {
      title: "Those Eyes",
      artist: "New West",
      album: "Indie Anthems",
      cover: cover1,
      src: song1,
    },
    {
      title: "Night Drive",
      artist: "FM-84",
      album: "Atlas",
      cover: cover2,
      src: song2,
    },
    {
      title: "Blinding Lights",
      artist: "The Weeknd",
      album: "After Hours",
      cover: cover3,
      src: song3,
    },
    {
      title: "Heat Waves",
      artist: "Glass Animals",
      album: "Dreamland",
      cover: cover4,
      src: song4,
    },
    {
      title: "Stay",
      artist: "The Kid LAROI, Justin Bieber",
      album: "Stay (Single)",
      cover: cover5,
      src: song5,
    },
    {
      title: "Levitating",
      artist: "Dua Lipa",
      album: "Future Nostalgia",
      cover: cover6,
      src: song6,
    },
    {
      title: "Lose Yourself",
      artist: "Eminem",
      album: "8 Mile (Soundtrack)",
      cover: cover7,
      src: song7,
    },
    {
      title: "Shape of You",
      artist: "Ed Sheeran",
      album: "÷ (Divide)",
      cover: cover8,
      src: song8,
    },
    {
      title: "Starboy",
      artist: "The Weeknd ft. Daft Punk",
      album: "Starboy",
      cover: cover9,
      src: song9,
    },
    {
      title: "Believer",
      artist: "Imagine Dragons",
      album: "Evolve",
      cover: cover10,
      src: song10,
    },
  ];

  const [currentSong, setCurrentSong] = useState(songs[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favorites")) || []
  );
  const [playlist, setPlaylist] = useState(
    JSON.parse(localStorage.getItem("playlist")) || []
  );
  const [filter, setFilter] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const [groupBy, setGroupBy] = useState("none");
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(0); // 0:none, 1:all, 2:one

  const audioRef = useRef(new Audio(currentSong.src));

  useEffect(() => {
    audioRef.current.src = currentSong.src;
    audioRef.current.volume = volume;
    if (isPlaying) audioRef.current.play();
  }, [currentSong]);

  useEffect(() => {
    const audio = audioRef.current;
    const updateProgress = () => {
      setProgress(audio.currentTime);
      setDuration(audio.duration || 0);
      if (audio.ended) handleSongEnd();
    };
    audio.addEventListener("timeupdate", updateProgress);
    return () => audio.removeEventListener("timeupdate", updateProgress);
  }, [currentSong]);

  useEffect(
    () => localStorage.setItem("favorites", JSON.stringify(favorites)),
    [favorites]
  );
  useEffect(
    () => localStorage.setItem("playlist", JSON.stringify(playlist)),
    [playlist]
  );

  const togglePlay = () => {
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const playNext = () => {
    if (shuffle) {
      const nextIndex = Math.floor(Math.random() * songs.length);
      setCurrentSong(songs[nextIndex]);
      setIsPlaying(true);
      return;
    }
    const index = songs.findIndex((s) => s.title === currentSong.title);
    setCurrentSong(songs[(index + 1) % songs.length]);
    setIsPlaying(true);
  };

  const playPrev = () => {
    const index = songs.findIndex((s) => s.title === currentSong.title);
    setCurrentSong(songs[(index - 1 + songs.length) % songs.length]);
    setIsPlaying(true);
  };

  // ✅ Fixed autoplay continuous playback
  const handleSongEnd = () => {
    if (repeat === 2) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else if (repeat === 1) {
      playNext();
    } else {
      const index = songs.findIndex((s) => s.title === currentSong.title);
      if (index < songs.length - 1) {
        setCurrentSong(songs[index + 1]);
        setIsPlaying(true);
      } else {
        setIsPlaying(false);
      }
    }
  };

  const formatTime = (sec) => {
    if (isNaN(sec)) return "0:00";
    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const toggleFavorite = (song) => {
    setFavorites((prev) =>
      prev.find((f) => f.title === song.title)
        ? prev.filter((f) => f.title !== song.title)
        : [...prev, song]
    );
  };

  const addToPlaylist = (song) => {
    if (!playlist.find((p) => p.title === song.title))
      setPlaylist([...playlist, song]);
  };

  const filteredSongs = songs
    .filter(
      (s) =>
        s.title.toLowerCase().includes(filter.toLowerCase()) ||
        s.artist.toLowerCase().includes(filter.toLowerCase()) ||
        s.album.toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) => a[sortBy].localeCompare(b[sortBy]));

  const groupedSongs =
    groupBy === "none"
      ? { All: filteredSongs }
      : filteredSongs.reduce((groups, song) => {
          const key = song[groupBy];
          if (!groups[key]) groups[key] = [];
          groups[key].push(song);
          return groups;
        }, {});

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* 🌈 8-Color Animated Heading */}
      <header className="p-4 bg-gradient-to-r from-gray-900 via-gray-800 to-black text-center shadow-md sticky top-0 z-20">
        <h1
          className="text-3xl sm:text-4xl font-extrabold tracking-widest 
                 text-transparent bg-clip-text 
                 bg-gradient-to-r 
                 from-pink-500 via-red-500 via-orange-400 via-yellow-400 
                 via-green-400 via-teal-400 via-blue-500 via-purple-500 to-pink-500
                 animate-gradient-text"
        >
          🎶 FinacPlus Music
        </h1>
      </header>

      {/* 🔍 Top Controls */}
      <div className="p-3 flex flex-row justify-between items-center bg-black/40 backdrop-blur-md border-b border-gray-800 shadow-lg sticky top-0 z-10 gap-2">
        <div className="relative w-2/3 sm:w-1/3 md:w-1/2">
          <input
            type="text"
            placeholder="Search..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full px-2 pr-8 py-1 text-xs sm:text-sm rounded-lg border border-gray-700 bg-gray-900 text-gray-200 shadow-sm focus:ring-2 focus:ring-purple-500 outline-none"
          />
          <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
            🔍
          </span>
        </div>
        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-2 py-1 text-xs sm:text-sm w-28 border border-gray-700 bg-gray-900 text-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500"
          >
            <option value="title">Sort by Title</option>
            <option value="artist">Sort by Artist</option>
            <option value="album">Sort by Album</option>
          </select>
          <select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value)}
            className="px-2 py-1 text-xs sm:text-sm w-28 border border-gray-700 bg-gray-900 text-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-pink-500"
          >
            <option value="none">No Group</option>
            <option value="album">Group by Album</option>
            <option value="artist">Group by Artist</option>
            <option value="title">Group by Title</option>
          </select>
        </div>
      </div>

      {/* 🎵 Songs Grid */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {Object.entries(groupedSongs).map(([group, songs]) => (
          <div key={group} className="p-4">
            {groupBy !== "none" && (
              <h2 className="text-lg font-bold text-pink-400 mb-2">{group}</h2>
            )}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 sm:gap-6">
              {songs.map((song, idx) => (
                <SongCard
                  key={idx}
                  song={song}
                  isFavorite={favorites.find((f) => f.title === song.title)}
                  onPlay={(s) => {
                    setCurrentSong(s);
                    setIsPlaying(true);
                  }}
                  onToggleFav={toggleFavorite}
                  onAddToPlaylist={addToPlaylist}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 🎶 Player Bar */}
      <footer className="bg-black/80 backdrop-blur-lg shadow-lg px-3 py-2 border-t border-gray-800 flex flex-col sm:flex-row sm:items-center sm:justify-between sticky bottom-0 gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <img
            src={currentSong.cover}
            alt={currentSong.title}
            className="w-10 h-10 rounded-md object-cover shadow-md"
          />
          <div className="truncate">
            <h4 className="text-sm font-semibold truncate">
              {currentSong.title}
            </h4>
            <p className="text-xs text-gray-400 truncate">
              {currentSong.artist}
            </p>
          </div>
          <button
            onClick={() => toggleFavorite(currentSong)}
            className={`ml-2 ${
              favorites.find((f) => f.title === currentSong.title)
                ? "text-green-500"
                : "text-gray-400"
            } hover:text-green-500`}
          >
            ❤️
          </button>
        </div>

        <div className="flex flex-col items-center flex-1 max-w-md">
          <div className="flex items-center gap-4 mb-1">
            <button
              onClick={() => setShuffle((prev) => !prev)}
              className={`w-5 h-5 ${
                shuffle ? "text-purple-400" : "text-gray-400"
              }`}
            >
              🔀
            </button>
            <SkipBack
              onClick={playPrev}
              className="w-5 h-5 cursor-pointer hover:text-purple-400"
            />
            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 hover:scale-110 transition flex items-center justify-center text-white"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </button>
            <SkipForward
              onClick={playNext}
              className="w-5 h-5 cursor-pointer hover:text-purple-400"
            />
            <button
              onClick={() => setRepeat((r) => (r + 1) % 3)}
              className={`w-5 h-5 ${
                repeat === 0
                  ? "text-gray-400"
                  : repeat === 1
                  ? "text-purple-400"
                  : "text-pink-400"
              }`}
            >
              🔁
            </button>
          </div>
          <div className="flex items-center gap-1 w-full text-xs text-gray-400">
            <span>{formatTime(progress)}</span>
            <input
              type="range"
              min="0"
              max={duration || 0}
              step="0.1"
              value={progress}
              onChange={(e) => {
                const time = parseFloat(e.target.value);
                audioRef.current.currentTime = time;
                setProgress(time);
              }}
              className="flex-1 accent-purple-500 h-1"
            />
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 sm:w-36 lg:w-40 justify-end flex-1">
          <Volume2 className="w-5 h-5" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              audioRef.current.volume = parseFloat(e.target.value);
            }}
            className="w-24 lg:w-28 accent-purple-500 h-2 rounded-lg cursor-pointer"
          />
        </div>
      </footer>
    </div>
  );
}
