import React, { useEffect, useState, createContext, useMemo } from "react";
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
//import Playback from "../../components/Playback/Playback";

const spotifyApi = new SpotifyWebApi({
  clientId: "6d45003bbeb748c2b3140ffb5c7c6626",
});

export const SongContext = createContext({ song: {}, setSong: () => {} });

export default function Home({ code }) {
  const accessToken = useAuth(code);

  const [gotUser, setGotUser] = useState(false);
  const [user, setUser] = useState({});
  const [song, setSong] = useState({});
  const value = useMemo(() => ({ song, setSong }), [song]);

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
    setGotUser(true);
  }, [accessToken]);

  useEffect(() => {
    if (!gotUser) return;
    spotifyApi.getMe().then(
      function (data) {
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
          <SongContext.Provider value={value}>
            <Header user={user} />
            <div className="container">
              <Routes>
                <Route path="*" element={<NotFound />} />
                <Route path="/" element={<LandingPage user={user} />} />
                <Route
                  path="/TopSongs"
                  element={<TopSongs spotifyApi={spotifyApi} />}
                />
                <Route
                  path="/FindSong"
                  element={<FindSong spotifyApi={spotifyApi} user={user} />}
                />
                <Route
                  path="/PlaylistCreator"
                  element={
                    <PlaylistCreator user={user} spotifyApi={spotifyApi} />
                  }
                />
                <Route
                  path="/Profile"
                  element={<Profile user={user} spotifyApi={spotifyApi} />}
                />
              </Routes>
            </div>
            {/*<Playback spotifyApi={spotifyApi} />*/}
          </SongContext.Provider>
        </>
      ) : (
        <></>
      )}
    </>
  );
}
