import React, { useEffect, useState } from "react";
import { FormGroup, TextField } from "@mui/material";
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

  const [playlistOriginalTitle, setPlaylistOriginalTitle] = useState("");
  const [playlistTitle, setPlaylistTitle] = useState("");
  // const [playlistDescription, setPlaylistDescription] = useState("");
  const [isPublicPlaylist, setIsPublicPlaylist] = useState(true);
  const [playlistTitleError, setPlaylistTitleError] = useState(false);
  const [playlistTitleErrorMessage, setPlaylistTitleErrorMessage] =
    useState("");
  //const [playlistDescriptionError, setPlaylistDescriptionError] =
  //  useState(false);
  //const [playlistImageBased65URI, setPlaylistImageBased65URI] = useState("");

  useEffect(() => {
    setPlaylistOriginalTitle(playlist.name);
    setPlaylistTitle(playlist.name);
    // setPlaylistDescription(playlist.description);
    setIsPublicPlaylist(playlist.public);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (playlistTitle.length < 1) {
      setPlaylistTitleErrorMessage("Playlist Title Required");
      setPlaylistTitleError(true);
    } else {
      setPlaylistTitleError(false);
    }
    /*
    if (playlistDescription.length < 1) {
      setPlaylistDescriptionError(true);
    } else {
      setPlaylistDescriptionError(false);
    }
    */
  }, [playlistTitle]);
  // }, [playlistTitle, playlistDescription]);

  /*
  useEffect(() => {
    console.log(playlistImageBased65URI);
  }, [playlistImageBased65URI]);
  */

  const modifyPlaylist = () => {
    /*
    if (playlistImageBased65URI.length > 0) {
      spotifyApi
        .uploadCustomPlaylistCoverImage(playlist.id, playlistImageBased65URI)
        .then(
          function (data) {
            console.log(console.log("Playlist Image Modiifed!"));
          },
          function (err) {
            console.log("Something went wrong!", err);
          }
        );
    }
    */

    if (playlistTitle === playlistOriginalTitle) {
      setPlaylistTitleErrorMessage("Playlist Title is still the same");
      setPlaylistTitleError(true);
      return;
    }

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

  /*
  const validateFile = (file) => {
    // console.log(file);
    let baseURL = "";
    let reader = new FileReader();
    reader.readAsDataURL(file);
    // console.log(reader);

    reader.onload = () => {
      // Make a fileInfo Object
      // console.log("Called", reader);
      baseURL = reader.result;
      setPlaylistImageBased65URI(baseURL);
    };
  };
  */

  return (
    <div className="modify-playlist-body">
      <h2 className="modify-playlist-header">Modify {playlistOriginalTitle}</h2>
      <FormGroup className="create-playlist-form">
        {playlistTitleError ? (
          <TextField
            error
            required
            label="Playlist Title"
            onChange={(e) => setPlaylistTitle(e.target.value)}
            defaultValue={playlist.name}
            helperText={playlistTitleErrorMessage}
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
          <h5>Public: {isPublicPlaylist.toString()}</h5>
          <Switch
            checked={isPublicPlaylist}
            onChange={(e) => setIsPublicPlaylist(e.target.checked)}
            inputProps={{ "aria-label": "controlled" }}
          />
        </div>

        {/** <input
          accept=".jpeg"
          type="file"
          onChange={(e) => validateFile(e.target.files[0])}
        />*/}

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
