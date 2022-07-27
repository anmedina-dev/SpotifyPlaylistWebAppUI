import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@emotion/react";
import ModifyPlaylist from "../ModifyPlaylist";
import "./PlaylistDropper.scss";

const buttomTheme = createTheme({
  palette: {
    primary: {
      main: "#964B00",
    },
  },
});

export default function PlaylistDropper(props) {
  const playlistTitle = props.title;
  const spotifyApi = props.spotifyApi;
  const user = props.user;

  const [playlistInfo, setPlaylistInfo] = useState();
  const [isModifyPlaylist, setModifyPlaylist] = useState(false);

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
      {playlistInfo ? (
        <>
          {!isModifyPlaylist ? (
            <>
              <ThemeProvider theme={buttomTheme}>
                <Button
                  variant="contained"
                  size="large"
                  color="primary"
                  onClick={() => setModifyPlaylist(true)}
                >
                  Modify Playlist
                </Button>
              </ThemeProvider>
              <h2>{playlistInfo.name}</h2>{" "}
            </>
          ) : (
            <ModifyPlaylist
              user={user}
              spotifyApi={spotifyApi}
              playlist={playlistInfo}
            />
          )}
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
