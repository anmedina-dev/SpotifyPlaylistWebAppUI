import React, { useEffect, useState, useContext } from "react";
import { SongContext } from "../../pages/Home/Home";
import "./SongCard.scss";

export default function SongCard(props) {
  const popularity = props.popularity;
  const songItem = props.song;
  const { song, setSong } = useContext(SongContext);
  const [artists, setArtists] = useState("");

  let popularityWidth;
  if (popularity) popularityWidth = { width: `${songItem.popularity}%` };

  useEffect(() => {
    let tempArtists = "";
    let index = 0;
    songItem.artists.forEach((artist) => {
      if (index === songItem.artists.length - 1) {
        tempArtists = tempArtists + ` ${artist.name}`;
      } else {
        tempArtists = tempArtists + ` ${artist.name}, `;
      }

      index++;
    });
    setArtists(tempArtists);
  }, [songItem.artists]);

  return (
    <>
      {popularity ? (
        <div
          onClick={() => {
            setSong(songItem);
          }}
          className="song-card-body"
          style={popularityWidth}
        >
          <img
            src={songItem.album.images[songItem.album.images.length - 1].url}
            alt="album-pic"
          />
          <div className="song-meta-data-section">
            <h5>{songItem.name}</h5>
            <p>{artists}</p>
          </div>
        </div>
      ) : (
        <div
          onClick={() => {
            setSong(songItem);
          }}
          className="song-card-body"
        >
          <img
            src={songItem.album.images[songItem.album.images.length - 1].url}
            alt="album-pic"
          />
          <div className="song-meta-data-section">
            <h5>{songItem.name}</h5>
            <p>{artists}</p>
          </div>
        </div>
      )}
    </>
  );
}
