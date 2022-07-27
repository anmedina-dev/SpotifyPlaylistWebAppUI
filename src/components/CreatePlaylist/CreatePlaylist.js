import React, { useState } from "react";
import "./CreatePlaylist.scss";
import { FormGroup, TextField } from "@mui/material";
import { Button } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@emotion/react";
import PlaylistDropper from "../PlaylistDropper";

const buttomTheme = createTheme({
  palette: {
    primary: {
      main: "#964B00",
    },
  },
});

export default function CreatePlaylist(props) {
  const user = props.user;
  const spotifyApi = props.spotifyApi;
  const [isPlaylistCreated, setIsPlaylistCreated] = useState(false);
  const [playlistTitle, setPlaylistTitle] = useState("");
  const [playlistDescription, setPlaylistDescription] = useState("");

  const createPlaylist = () => {
    spotifyApi
      .createPlaylist(user.id, playlistTitle, {
        // public is the only option currently available in the API
        // description: playlistDescription,
        public: true,
      })
      .then(
        function (data) {
          console.log("Created playlist!");
          setIsPlaylistCreated(true);
        },
        function (err) {
          console.log("Something went wrong!", err);
        }
      );
  };

  return (
    <div className="create-playlist-body">
      {!isPlaylistCreated ? (
        <FormGroup className="create-playlist-form">
          <TextField
            required
            label="Playlist Title"
            onChange={(e) => setPlaylistTitle(e.target.value)}
          />
          <TextField
            required
            label="Playlist Description"
            onChange={(e) => setPlaylistDescription(e.target.value)}
          />
          <ThemeProvider theme={buttomTheme}>
            <Button
              variant="contained"
              size="large"
              color="primary"
              onClick={createPlaylist}
            >
              Submit
            </Button>
          </ThemeProvider>
        </FormGroup>
      ) : (
        <PlaylistDropper
          spotifyApi={spotifyApi}
          title={playlistTitle}
          user={user}
        />
      )}
    </div>
  );
}
