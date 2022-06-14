import React, { useState, useContext, useEffect } from "react";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import { PrettoSlider } from "../PrettoSlider";
import VolumeDown from "@mui/icons-material/VolumeDown";
import VolumeUp from "@mui/icons-material/VolumeUp";
import RepeatIcon from "@mui/icons-material/Repeat";
import { SongContext } from "../../pages/Home/Home";
import "./Playback.scss";

export default function Playback(props) {
  const spotifyApi = props.spotifyApi;
  const { song, setSong } = useContext(SongContext);
  const [artists, setArtists] = useState("");
  const [inPlay, setInPlay] = useState(false);
  const [volume, setVolume] = useState(50);
  const [initialSongProgress, setInitialSongProgress] = useState(0);
  const [songDuration, setSongDuration] = useState(0);
  const [songProgress, setSongProgress] = useState(0);

  const handleChange = (event, newValue) => {
    setVolume(newValue);
  };

  const handlePlayPause = () => {
    setInPlay(!inPlay);
  };

  const handleNext = () => {
    spotifyApi.skipToNext().then(
      function () {
        console.log("Skip to next");
      },
      function (err) {
        //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
        console.log("Something went wrong!", err);
      }
    );
  };

  const handlePrevious = () => {
    spotifyApi.skipToNext().then(
      function () {
        console.log("Skip to next");
      },
      function (err) {
        //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
        console.log("Something went wrong!", err);
      }
    );
  };

  useEffect(() => {
    spotifyApi.getMyCurrentPlaybackState().then(
      function (data) {
        // Output items
        if (data.body && data.body.is_playing) {
          console.log(data.body);
          console.log("User is currently playing something!");
          setSong(data.body.item);
          setInPlay(true);
          setVolume(data.body.device.volume_percent);
          setInitialSongProgress(data.body.progress_ms);
          setSongDuration(data.body.item.duration_ms);
        } else {
          console.log("User is not playing anything, or doing so in private.");
        }
      },
      function (err) {
        console.log("Something went wrong!", err);
      }
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!song) return;

    if (inPlay) {
      // Start/Resume a User's Playback
      spotifyApi.play().then(
        function () {
          console.log("Playback started");
        },
        function (err) {
          //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
          console.log("Something went wrong!", err);
        }
      );
    }
    if (!inPlay) {
      spotifyApi.pause().then(
        function () {
          console.log("Playback paused");
        },
        function (err) {
          //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
          console.log("Something went wrong!", err);
        }
      );
    }
  }, [inPlay]);

  useEffect(() => {
    spotifyApi.setVolume(volume).then(
      function () {
        console.log(`Setting volume to ${volume}.`);
      },
      function (err) {
        //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
        console.log("Something went wrong!", err);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [volume]);

  useEffect(() => {
    if (!song.artists) return;
    let tempArtists = "";
    let index = 0;
    song.artists.forEach((artist) => {
      if (index === song.artists.length - 1) {
        tempArtists = tempArtists + ` ${artist.name}`;
      } else {
        tempArtists = tempArtists + ` ${artist.name}, `;
      }

      index++;
    });
    setArtists(tempArtists);
  }, [song.artists]);

  useEffect(() => {
    setInterval(() => {
      if (!inPlay) return;
      setSongProgress((initialSongProgress / songDuration) * 100);
      setInitialSongProgress(songProgress + 1000);
    }, 1000);
  }, [song]);

  return (
    <>
      <div className="playback-body">
        <div className="playback-song">
          {Object.keys(song).length !== 0 ? (
            <>
              <img
                src={song.album.images[song.album.images.length - 1].url}
                alt="album-pic"
              />
              <div className="playback-song-meta-data">
                <h5>{song.name}</h5>
                <p>{artists}</p>
              </div>
              <Box sx={{ width: "100%" }}>
                <LinearProgress variant="determinate" value={songProgress} />
              </Box>
            </>
          ) : (
            <></>
          )}
        </div>
        <div className="playback-controls">
          <SkipPreviousIcon fontSize="large" onClick={handlePrevious} />
          {!inPlay ? (
            <PlayCircleIcon fontSize="large" onClick={handlePlayPause} />
          ) : (
            <PauseCircleIcon fontSize="large" onClick={handlePlayPause} />
          )}
          <SkipNextIcon fontSize="large" onClick={handleNext} />
          <RepeatIcon fontSize="large" />
        </div>
        <div className="playback-volume">
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={2}
          >
            <VolumeDown />
            <PrettoSlider
              valueLabelDisplay="auto"
              aria-label="pretto slider"
              defaultValue={volume}
              onChange={handleChange}
            />
            <VolumeUp />
          </Stack>
        </div>
      </div>
    </>
  );
}
