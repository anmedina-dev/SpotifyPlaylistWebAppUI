import React, { useState } from "react";
import "./PlaylistDropper.scss";
export default function PlaylistDropper(props) {
  const playlistTitle = props.title;
  const spotifyApi = props.spotifyApi;
  const user = props.user;

  const [playlistInfo, setPlaylistInfo] = useState();

  useState(() => {
    spotifyApi.getUserPlaylists(user.id).then(
      function (data) {
        console.log("Retrieved playlists", data.body);
        const unoPlaylist = data.body.items.filter(
          (playlist) => playlist.name === playlistTitle
        );
        setPlaylistInfo(unoPlaylist[0]);
      },
      function (err) {
        console.log("Something went wrong!", err);
      }
    );
  }, []);

  return (
    <div className="playlist-dropper-body">
      <h2>{playlistTitle}</h2>
      <h2>{playlistInfo.name}</h2>
    </div>
  );
}
