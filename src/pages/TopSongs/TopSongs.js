import React, { useEffect, useState } from "react";
import SongCard from "../../components/SongCard";
import "./TopSongs.scss";

export default function TopSongs(props) {
  const spotifyApi = props.spotifyApi;

  const [TopSongs, setTopSongs] = useState([]);

  useEffect(() => {
    spotifyApi.getMyTopTracks().then(
      function (data) {
        console.log(data.body.items);
        setTopSongs(data.body.items);
      },
      function (err) {
        console.log("Something went wrong!", err);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const topSongsList = TopSongs.map((song) => (
    <SongCard popularity={true} song={song} />
  ));

  return (
    <div className="top-songs-body">
      <h1>Your Top Songs</h1>
      <div className="list">
        <h4>Song</h4>
        <h4>Popularity</h4>
      </div>
      <div className="top-song-list">{topSongsList}</div>
    </div>
  );
}
