import React from "react";
import { Heart } from "lucide-react";

export default function SongCard({ song, isFavorite, onPlay, onToggleFav }) {
  return (
    <div className="group relative bg-gray-900/60 rounded-xl shadow-md hover:shadow-2xl transition transform hover:scale-105 cursor-pointer overflow-hidden">
      {/* 🎵 Album Cover */}
      <div className="relative">
        <img
          src={song.cover}
          alt={song.title}
          className="w-32 h-32 sm:w-36 sm:h-36 object-cover rounded-lg mx-auto mt-3 shadow-md group-hover:opacity-90 transition"
          onClick={() => onPlay(song)}
        />

        {/* ❤️ Favorite Icon (top-right corner on cover) */}
        <button
          onClick={() => onToggleFav(song)}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 transition"
        >
          <Heart
            className={`w-6 h-6 transition ${
              isFavorite
                ? "text-red-500 fill-red-500"
                : "text-gray-300 hover:text-red-400"
            }`}
          />
        </button>
      </div>

      {/* 📄 Song Info */}
      <div className="p-3 text-center">
        <h3
          className="font-semibold text-white truncate"
          onClick={() => onPlay(song)}
        >
          {song.title}
        </h3>
        <p className="text-sm text-gray-400 truncate">{song.artist}</p>
      </div>
    </div>
  );
}
