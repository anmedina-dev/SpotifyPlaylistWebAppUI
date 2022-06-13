import React, { useState, useContext, useEffect } from "react";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import Stack from "@mui/material/Stack";
import Slider from "@mui/material/Slider";
import VolumeDown from "@mui/icons-material/VolumeDown";
import VolumeUp from "@mui/icons-material/VolumeUp";
import RepeatIcon from "@mui/icons-material/Repeat";
import { styled } from "@mui/material/styles";
import { SongContext } from "../../pages/Home/Home";
import "./Playback.scss";

const PrettoSlider = styled(Slider)({
  color: "#52af77",
  height: 8,
  "& .MuiSlider-track": {
    border: "none",
  },
  "& .MuiSlider-thumb": {
    height: 24,
    width: 24,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
      boxShadow: "inherit",
    },
    "&:before": {
      display: "none",
    },
  },
  "& .MuiSlider-valueLabel": {
    lineHeight: 1.2,
    fontSize: 12,
    background: "unset",
    padding: 0,
    width: 32,
    height: 32,
    borderRadius: "50% 50% 50% 0",
    backgroundColor: "#52af77",
    transformOrigin: "bottom left",
    transform: "translate(50%, -100%) rotate(-45deg) scale(0)",
    "&:before": { display: "none" },
    "&.MuiSlider-valueLabelOpen": {
      transform: "translate(50%, -100%) rotate(-45deg) scale(1)",
    },
    "& > *": {
      transform: "rotate(45deg)",
    },
  },
});

export default function Playback(props) {
  const spotifyApi = props.spotifyApi;
  const { song } = useContext(SongContext);
  const [artists, setArtists] = useState("");
  const [inPlay, setInPlay] = useState(false);
  const [volume, setVolume] = useState(50);

  const handleChange = (event, newValue) => {
    setVolume(newValue);
  };

  const handlePlayPause = () => {
    setInPlay(!inPlay);
  };

  useEffect(() => {
    spotifyApi.getMyCurrentPlaybackState().then(
      function (data) {
        // Output items
        if (data.body && data.body.is_playing) {
          console.log(data.body);
          console.log("User is currently playing something!");
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
            </>
          ) : (
            <></>
          )}
        </div>
        <div className="playback-controls">
          <SkipPreviousIcon fontSize="large" />
          {!inPlay ? (
            <PlayCircleIcon fontSize="large" onClick={handlePlayPause} />
          ) : (
            <PauseCircleIcon fontSize="large" onClick={handlePlayPause} />
          )}
          <SkipNextIcon fontSize="large" />
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
