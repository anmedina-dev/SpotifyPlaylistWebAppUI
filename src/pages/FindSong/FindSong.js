import React, { useEffect, useState } from "react";
import SongCard from "../../components/SongCard";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import "./FindSong.scss";
import MiniPlaylistCard from "../../components/MiniPlaylistCard";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  height: 600,
  bgcolor: "#000",
  color: "#FFF",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function FindSong(props) {
  const user = props.user;
  const spotifyApi = props.spotifyApi;
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [pickedSong, setPickedSong] = useState();
  const [songList, setSongList] = useState();
  const [alertIsVisable, setIsAlertVisible] = useState(false);

  function handleOpen(song) {
    console.log(song);
    setPickedSong(song);
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  function handleAddSongToPlaylist(playlist, song) {
    console.log(playlist);

    console.log(song);
    spotifyApi.getPlaylist(playlist.id).then(
      function (data) {
        console.log(data.body.tracks.items);
        console.log(song);
        const isSongThere = data.body.tracks.items.filter(
          (e) => e.track.uri === song.uri
        );
        // console.log("playlist", data.body);
        if (isSongThere > 0) {
          console.log("sup!");
          setIsAlertVisible(true);
          setTimeout(() => {
            setIsAlertVisible(false);
          }, 3000);
        } else {
          // spotifyApi.addTracksToPlaylist(playlist.id, [song.uri]);
        }
      },
      function (err) {
        console.log("Something went wrong!", err);
      }
    );

    /*
    if (playlist.tracks.filter((x) => (x.uri = song.uri))) {
      console.log("sup!");
      setIsAlertVisible(true);
      setTimeout(() => {
        setIsAlertVisible(false);
      }, 3000);
    } else {
      // spotifyApi.addTracksToPlaylist(playlist.id, [song.uri]);
    }
    */

    setOpen(false);
  }

  useEffect(() => {
    spotifyApi.getUserPlaylists(user.id).then(
      function (data) {
        const tempPlaylist = data.body.items;
        const filteredPlaylist = tempPlaylist.filter(
          (playlist) => playlist.owner.id === user.id
        );
        console.log("Retrieved playlists", filteredPlaylist);
        setUserPlaylists(
          filteredPlaylist.map((playlist) => (
            <MiniPlaylistCard
              playlist={playlist}
              onclick={() => handleAddSongToPlaylist(playlist, pickedSong)}
            />
          ))
        );
      },
      function (err) {
        console.log("Something went wrong!", err);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!searchInput) return;

    spotifyApi.searchTracks(searchInput).then(
      function (data) {
        setSearchResults(data.body.tracks.items);
      },
      function (err) {
        console.error(err);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  useEffect(() => {
    if (searchResults.length < 1) return;

    console.log(searchResults);
    setSongList(
      searchResults.map((song) => (
        <div onClick={() => handleOpen(song)}>
          <SongCard song={song} />
        </div>
      ))
    );
  }, [searchResults]);

  return (
    <div className="find-song-body">
      <h3>Search Song on Spotify!</h3>
      <div className="search-section">
        <input
          className="find-song-search-bar"
          type="text"
          placeholder="Search.."
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>
      {alertIsVisable && (
        <div className="find-song-error-message">Song Already in Playlist!</div>
      )}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add to Playlist
          </Typography>
          <div className="modal-playlists">{userPlaylists}</div>
        </Box>
      </Modal>
      <div className="result-section">
        {searchResults.length !== 0 ? (
          <div className="results">{songList}</div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
