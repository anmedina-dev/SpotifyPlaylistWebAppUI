import React, { useEffect, useState } from "react";
import PlaylistCard from "../PlaylistCard";
import PlaylistDropper from "../PlaylistDropper";
import "./ExistingPlaylists.scss";

export default function ExistingPlaylists(props) {
  const user = props.user;
  const spotifyApi = props.spotifyApi;
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [chosenPlaylist, setChosenPlaylist] = useState();
  const [isChosenPlaylist, setIsChosenPlaylist] = useState(false);

  useEffect(() => {
    spotifyApi.getUserPlaylists(user.id).then(
      function (data) {
        const tempPlaylist = data.body.items;
        const filteredPlaylist = tempPlaylist.filter(
          (playlist) => playlist.owner.id === user.id
        );
        console.log("Retrieved playlists", filteredPlaylist);
        setUserPlaylists(
          filteredPlaylist.map((playlist) => (
            <PlaylistCard
              playlist={playlist}
              onClick={() => setChosenPlaylist(playlist)}
            />
          ))
        );
      },
      function (err) {
        console.log("Something went wrong!", err);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!chosenPlaylist) return;
    setIsChosenPlaylist(true);
  }, [chosenPlaylist]);
  /*
  const chosePlaylist = (playlist) => {
    setChosenPlaylist(playlist);
    setIsChosenPlaylist(true);
    console.log("hey");
  };
*/
  return (
    <div className="existing-playlists-body">
      {!isChosenPlaylist ? (
        <>
          <h4>Pick a Playlist of yours to edit!</h4>
          <div className="playlist-list">{userPlaylists && userPlaylists}</div>
        </>
      ) : (
        <PlaylistDropper
          spotifyApi={spotifyApi}
          title={chosenPlaylist.name}
          user={user}
        />
      )}
    </div>
  );
}
