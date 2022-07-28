import React, { useState } from "react";
import { Button } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@emotion/react";
import ExistingPlaylists from "../../components/ExistingPlaylists";
import CreatePlaylist from "../../components/CreatePlaylist";
import "./PlaylistCreator.scss";

const buttomTheme = createTheme({
  palette: {
    primary: {
      main: "#964B00",
    },
  },
});

export default function PlaylistCreator(props) {
  const user = props.user;
  const spotifyApi = props.spotifyApi;
  const [showButtons, setShowButtons] = useState(true);
  const [isCreateNewPlaylist, setIsCreateNewPlaylist] = useState(false);

  const setToNewPlaylistComponent = () => {
    setShowButtons(false);
    setIsCreateNewPlaylist(true);
  };
  const setToPickExistingPlaylistComponent = () => {
    setShowButtons(false);
    setIsCreateNewPlaylist(false);
  };

  return (
    <div className="playlist-creator-body">
      <div className="playlist-creator-header">
        <h2
          onClick={() => setShowButtons(true)}
          className="playist-creator-header"
        >
          Playlist Dropper
        </h2>
      </div>
      <div className="playlist-dropper-body">
        {showButtons ? (
          <div className="playlist-button-decider-section">
            <ThemeProvider theme={buttomTheme}>
              <Button
                variant="contained"
                size="large"
                color="primary"
                onClick={setToNewPlaylistComponent}
              >
                Create New Playlist
              </Button>
              <Button
                variant="contained"
                size="large"
                color="primary"
                onClick={setToPickExistingPlaylistComponent}
              >
                Use Existing Playlist
              </Button>
            </ThemeProvider>
          </div>
        ) : (
          <>
            {isCreateNewPlaylist ? (
              <CreatePlaylist user={user} spotifyApi={spotifyApi} />
            ) : (
              <ExistingPlaylists user={user} spotifyApi={spotifyApi} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
