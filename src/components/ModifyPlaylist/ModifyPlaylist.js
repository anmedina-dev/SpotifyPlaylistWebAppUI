import React, { useEffect, useState } from "react";
import { FormGroup, Input, TextField } from "@mui/material";
import { Button } from "@mui/material";
import Switch from "@mui/material/Switch";
import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@emotion/react";
import "./ModifyPlaylist.scss";

const buttomTheme = createTheme({
  palette: {
    primary: {
      main: "#964B00",
    },
  },
});

export default function ModifyPlaylist(props) {
  const playlist = props.playlist;
  const spotifyApi = props.spotifyApi;
  // const user = props.user;

  const [playlistTitle, setPlaylistTitle] = useState("");
  const [playlistDescription, setPlaylistDescription] = useState("");
  const [isPublicPlaylist, setIsPublicPlaylist] = useState(true);
  const [playlistTitleError, setPlaylistTitleError] = useState(false);
  const [playlistDescriptionError, setPlaylistDescriptionError] =
    useState(false);

  useEffect(() => {
    setPlaylistTitle(playlist.name);
    setPlaylistDescription(playlist.description);
    setIsPublicPlaylist(playlist.public);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (playlistTitle.length < 1) {
      setPlaylistTitleError(true);
    } else {
      setPlaylistTitleError(false);
    }
    if (playlistDescription.length < 1) {
      setPlaylistDescriptionError(true);
    } else {
      setPlaylistDescriptionError(false);
    }
  }, [playlistTitle, playlistDescription]);

  const modifyPlaylist = () => {
    spotifyApi
      .changePlaylistDetails(playlist.id, {
        name: playlistTitle,
        // description: playlistDescription,
        public: isPublicPlaylist,
      })
      .then(
        function (data) {
          console.log("Playlist modified!");
        },
        function (err) {
          console.log("Something went wrong!", err);
        }
      );
  };

  const validateFile = (file) => {
    console.log(file);
  };

  return (
    <div className="modify-playlist-body">
      <h2 className="modify-playlist-header">Modify {playlist.name}</h2>
      <FormGroup className="create-playlist-form">
        {playlistTitleError ? (
          <TextField
            error
            required
            label="Playlist Title"
            onChange={(e) => setPlaylistTitle(e.target.value)}
            defaultValue={playlist.name}
            helperText="Playlist Title Required"
          />
        ) : (
          <TextField
            required
            label="Playlist Title"
            onChange={(e) => setPlaylistTitle(e.target.value)}
            defaultValue={playlist.name}
          />
        )}
        {/*
        {playlistDescriptionError ? (
          <TextField
            error
            required
            label="Playlist Description"
            onChange={(e) => setPlaylistDescription(e.target.value)}
            defaultValue={playlist.description}
          />
        ) : (
          <TextField
            required
            label="Playlist Title"
            onChange={(e) => setPlaylistTitle(e.target.value)}
            defaultValue={playlist.name}
          />
        ) */}

        <div className="modify-playlist-switch">
          <h5>public: {isPublicPlaylist.toString()}</h5>
          <Switch
            checked={isPublicPlaylist}
            onChange={(e) => setIsPublicPlaylist(e.target.checked)}
            inputProps={{ "aria-label": "controlled" }}
          />
        </div>

        <input accept="*.jpg" type="file" />

        <ThemeProvider theme={buttomTheme}>
          <Button
            variant="contained"
            size="large"
            color="primary"
            onClick={modifyPlaylist}
          >
            Save
          </Button>
        </ThemeProvider>
      </FormGroup>
    </div>
  );
}
