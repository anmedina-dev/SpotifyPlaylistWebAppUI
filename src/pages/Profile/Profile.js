import React, { useEffect, useState } from "react";
import SongCard from "../../components/SongCard";
import "./Profile.scss";

export default function Profile(props) {
  const user = props.user;
  const spotifyApi = props.spotifyApi;

  const [recentlyPlayedSongs, setRecentlySongs] = useState([]);

  useEffect(() => {
    spotifyApi
      .getMyRecentlyPlayedTracks({
        limit: 6,
      })
      .then(
        function (data) {
          setRecentlySongs(data.body.items);
        },
        function (err) {
          console.log("Something went wrong!", err);
        }
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const recentlyPlayedSongsList = recentlyPlayedSongs.map((song) => (
    <SongCard song={song.track} />
  ));

  return (
    <div className="profile-body">
      <div className="profile-title-section">
        <img src={user.images[0].url} alt="profile_pic" />
        <h2>{user.display_name}</h2>
      </div>
      <div className="profile-sub-title-section">
        <div>{user.id}</div>
        <div>{user.followers.total} followers</div>
        <div>
          <a target="_blank" href={user.external_urls.spotify} rel="noreferrer">
            Spotify Profile
          </a>
        </div>
      </div>
      <div className="profile-body-section">
        <div className="profile-recently-played-section">
          <h3>Recently Played</h3>
          <div className="list">{recentlyPlayedSongsList}</div>
        </div>
      </div>
    </div>
  );
}
