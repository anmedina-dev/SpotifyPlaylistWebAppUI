import React, { useEffect, useState, useContext } from "react";
import { SongContext } from "../../pages/Home/Home";
import styled, { keyframes } from "styled-components";
import "./SongCard.scss";

export default function SongCard(props) {
  const ref = props.ref;
  const popularity = props.popularity;
  const songItem = props.song;
  const { setSong } = useContext(SongContext);
  const [artists, setArtists] = useState("");

  const widthTransition = keyframes`
  from {
    width: 8%;
  }

  to {
    width: ${songItem.popularity}%;
  }
`;

  const WidthTransition = styled.div`
    width: ${songItem.popularity}%;
    animation: ${widthTransition} 2s ease-in;
  `;

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
        <WidthTransition ref={ref}>
          <div className="song-card-body">
            <img
              src={songItem.album.images[songItem.album.images.length - 1].url}
              alt="album-pic"
            />
            <div className="song-meta-data-section">
              <h5>{songItem.name}</h5>
              <p>{artists}</p>
            </div>
          </div>
        </WidthTransition>
      ) : (
        <div className="song-card-body" ref={ref}>
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
