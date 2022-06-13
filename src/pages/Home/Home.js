import React, { useEffect, useState } from "react";
import SpotifyWebApi from "spotify-web-api-node";
import Header from "../../components/Header";
import useAuth from "../../components/useAuth";
import { Route, Routes } from "react-router-dom";
import NotFound from "../NotFound";
import LandingPage from "../LandingPage";
import TopSongs from "../TopSongs";
import PlaylistCreator from "../PlaylistCreator";
import Profile from "../Profile";
import FindSong from "../FindSong";

const spotifyApi = new SpotifyWebApi({
  clientId: "6d45003bbeb748c2b3140ffb5c7c6626",
});

export default function Home({ code }) {
  const accessToken = useAuth(code);

  const [gotUser, setGotUser] = useState(false);
  const [user, setUser] = useState({});

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
    setGotUser(true);
  }, [accessToken]);

  useEffect(() => {
    if (!gotUser) return;
    spotifyApi.getMe().then(
      function (data) {
        console.log("Some information about the authenticated user", data.body);
        setUser(data.body);
      },
      function (err) {
        console.log("Something went wrong!", err);
      }
    );
  }, [gotUser]);

  return (
    <>
      {Object.keys(user).length !== 0 ? (
        <>
          <Header user={user} />
          <div className="container">
            <Routes>
              <Route path="*" element={<NotFound />} />
              <Route path="/" element={<LandingPage />} />
              <Route path="/TopSongs" element={<TopSongs />} />
              <Route
                path="/FindSong"
                element={<FindSong spotifyApi={spotifyApi} />}
              />
              <Route path="/PlaylistCreator" element={<PlaylistCreator />} />
              <Route
                path="/Profile"
                element={<Profile user={user} spotifyApi={spotifyApi} />}
              />
            </Routes>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
}
