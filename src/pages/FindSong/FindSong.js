import React, { useEffect, useState } from "react";
import SongCard from "../../components/SongCard";
import "./FindSong.scss";

export default function FindSong(props) {
  const spotifyApi = props.spotifyApi;
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (!searchInput) return;

    spotifyApi.searchTracks(searchInput).then(
      function (data) {
        setSearchResults(data.body.tracks.items);
      },
      function (err) {
        console.error(err);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  const songList = searchResults.map((song) => <SongCard song={song} />);

  return (
    <div className="find-song-body">
      <h3>Search Song on Spotify!</h3>
      <div className="search-section">
        <input
          className="find-song-search-bar"
          type="text"
          placeholder="Search.."
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>

      <div className="result-section">
        {searchResults.length !== 0 ? (
          <div className="results">{songList}</div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
