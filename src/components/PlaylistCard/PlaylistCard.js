import React from "react";
import "./PlaylistCard.scss";

export default function PlaylistCard(props) {
  const playlistInfo = props.playlist;
  console.log(playlistInfo);

  return (
    <div onClick={props.onClick} className="playlist-card-body">
      Hey
    </div>
  );
}
