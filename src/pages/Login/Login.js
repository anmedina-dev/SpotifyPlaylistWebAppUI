import React from "react";
import { Button } from "@mui/material";
import "./Login.scss";
import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@emotion/react";

const buttomTheme = createTheme({
  palette: {
    primary: {
      main: "#964B00",
    },
  },
});

const AUTH_URL =
  "https://accounts.spotify.com/authorize?client_id=6d45003bbeb748c2b3140ffb5c7c6626&response_type=code&redirect_uri=http://localhost:8080/&scope=ugc-image-upload%20user-read-recently-played%20user-read-playback-state%20user-read-email%20streaming%20user-top-read%20playlist-modify-public%20user-read-currently-playing%20user-library-read%20playlist-read-private%20playlist-modify-private";

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
            href={AUTH_URL}
          >
            Login
          </Button>
        </ThemeProvider>
      </div>
    </div>
  );
}
