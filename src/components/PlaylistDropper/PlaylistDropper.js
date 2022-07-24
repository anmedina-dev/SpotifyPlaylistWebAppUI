import React, { useState, useEffect } from "react";
import "./PlaylistDropper.scss";
export default function PlaylistDropper(props) {
  const playlistTitle = props.title;
  const spotifyApi = props.spotifyApi;
  const user = props.user;

  const [playlistInfo, setPlaylistInfo] = useState();

  useEffect(() => {
    spotifyApi.getUserPlaylists(user.id).then(
      function (data) {
        console.log("Retrieved playlists", data.body);
        const unoPlaylist = data.body.items.filter(
          (playlist) => playlist.name === playlistTitle
        );
        console.log(unoPlaylist);
        setPlaylistInfo(unoPlaylist[0]);
      },
      function (err) {
        console.log("Something went wrong!", err);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="playlist-dropper-body">
      {playlistInfo ? <h2>{playlistInfo.name}</h2> : <></>}
    </div>
  );
}
