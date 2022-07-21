import React from "react";
import SpotifyWebApi from "spotify-web-api-node";
import "./Login.scss";
import { Button } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@emotion/react";

const buttomTheme = createTheme({
  palette: {
    primary: {
      main: "#964B00",
    },
  },
});

const scopes = [
    "user-read-private",
    "user-read-email",
    "ugc-image-upload",
    "user-modify-playback-state",
    "user-read-recently-played",
    "user-read-playback-position",
    "user-read-playback-state",
    "streaming",
    "app-remote-control",
    "user-top-read",
    "playlist-modify-public",
    "user-library-modify",
    "user-follow-read",
    "user-read-currently-playing",
    "user-library-read",
    "playlist-read-private",
    "playlist-modify-private",
  ],
  redirectUri = "http://localhost:8080/",
  clientId = "6d45003bbeb748c2b3140ffb5c7c6626";

const spotifyApi = new SpotifyWebApi({
  redirectUri: redirectUri,
  clientId: clientId,
});

const authorizeURL = spotifyApi.createAuthorizeURL(scopes);

export default function Login() {
  return (
    <div className="login-body">
      <div className="login-header">
        <h3>Welcome to...</h3>
        <h1>SPOTIFY PLAYLIST DROP &amp; PLAY</h1>
      </div>

      <div className="login-button-section">
        <h5>Login to your spotify to get started!</h5>
        <ThemeProvider theme={buttomTheme}>
          <Button
            variant="contained"
            size="large"
            color="primary"
            href={authorizeURL}
          >
            Login
          </Button>
        </ThemeProvider>
      </div>
    </div>
  );
}
