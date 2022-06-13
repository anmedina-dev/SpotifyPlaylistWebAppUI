import React, { useEffect, useState } from "react";
import "./SongCard.scss";

export default function SongCard(props) {
  const song = props.song;

  const [artists, setArtists] = useState("");

  useEffect(() => {
    let tempArtists = "";
    let index = 0;
    song.artists.forEach((artist) => {
      if (index === song.artists.length - 1) {
        tempArtists = tempArtists + ` ${artist.name}`;
      } else {
        tempArtists = tempArtists + ` ${artist.name}, `;
      }

      index++;
    });
    setArtists(tempArtists);
  }, [song.artists]);

  return (
    <div className="song-card-body">
      <img
        src={song.album.images[song.album.images.length - 1].url}
        alt="album-pic"
      />
      <div className="song-meta-data-section">
        <h5>{song.name}</h5>
        <p>{artists}</p>
      </div>
    </div>
  );
}
