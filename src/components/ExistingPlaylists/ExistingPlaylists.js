import React, { useEffect, useState } from "react";
import "./ExistingPlaylists.scss";

export default function ExistingPlaylists(props) {
  const user = props.user;
  const spotifyApi = props.spotifyApi;
  const [userPlaylists, setUserPlaylists] = useState();

  useEffect(() => {
    spotifyApi.getUserPlaylists(user.id).then(
      function (data) {
        console.log("Retrieved playlists", data.body);
      },
      function (err) {
        console.log("Something went wrong!", err);
      }
    );
  }, []);
  return <div>ExistingPlaylists</div>;
}
