import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@emotion/react";
import ModifyPlaylist from "../ModifyPlaylist";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./PlaylistDropper.scss";
import SongCard from "../SongCard";

const buttomTheme = createTheme({
  palette: {
    primary: {
      main: "#964B00",
    },
  },
});

export default function PlaylistDropper(props) {
  const playlistTitle = props.title;
  const spotifyApi = props.spotifyApi;
  const user = props.user;

  const [playlistInfo, setPlaylistInfo] = useState();
  const [isModifyPlaylist, setModifyPlaylist] = useState(false);
  const [existingPlaylistSongs, setExistingPlaylistSongs] = useState();
  const [recommendedSongs, setRecommendedSongs] = useState();

  useEffect(() => {
    spotifyApi.getUserPlaylists(user.id).then(
      function (data) {
        const unoPlaylist = data.body.items.filter(
          (playlist) => playlist.name === playlistTitle
        );
        //setPlaylistInfo(unoPlaylist[0]);

        // Get playlist songs
        spotifyApi.getPlaylist(unoPlaylist[0].id).then(
          function (data) {
            console.log("Some information about this playlist", data.body);
            setPlaylistInfo(data.body);

            const songs = data.body.tracks.items;
            console.log(songs);
            const artists = [];
            songs.forEach((song) => {
              const subArtists = song.track.artists;
              subArtists.forEach((subArtist) => {
                artists.push(subArtist.id);
              });
              //artists.push(song.track.artists.id);
            });
            console.log(artists);

            // Get Recommendations Based on Seeds
            spotifyApi
              .getRecommendations({
                min_energy: 0.4,
                seed_artists: artists,
                min_popularity: 50,
              })
              .then(
                function (data) {
                  let recommendations = data.body;
                  console.log(recommendations);

                  setRecommendedSongs(
                    recommendations.tracks.map((song, index) => (
                      <Draggable
                        draggableId={song.id}
                        key={song.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <SongCard popularity={false} song={song} />
                          </div>
                        )}
                      </Draggable>
                    ))
                  );
                },
                function (err) {
                  console.log("Something went wrong!", err);
                }
              );

            setExistingPlaylistSongs(
              data.body.tracks.items.map((song, index) => (
                <Draggable
                  draggableId={song.track.id}
                  key={song.track.id}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <SongCard popularity={false} song={song.track} />
                    </div>
                  )}
                </Draggable>
              ))
            );
          },
          function (err) {
            console.log("Something went wrong!", err);
          }
        );
      },
      function (err) {
        console.log("Something went wrong!", err);
      }
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      if (source.droppableId === "existingSongs") {
        const newOrder = [...existingPlaylistSongs];
        newOrder.splice(source.index, 1);
        newOrder.splice(destination.index, 0, draggableId);
        setExistingPlaylistSongs(newOrder);
      }
      if (source.droppableId === "recommended-songs") {
        const newOrder = [...recommendedSongs];
        newOrder.splice(source.index, 1);
        newOrder.splice(destination.index, 0, draggableId);
        setRecommendedSongs(newOrder);
      }
    }

    /*
    console.log(result);
    const songs = [...existingPlaylistSongs];

    const [orderedSongs] = songs.splice(result.source.index, 1);
    songs.splice(result.destination.index, 0, orderedSongs);
    //setExistingPlaylistSongs(orderedSongs);
    */
  };

  return (
    <div className="playlist-dropper-body">
      {playlistInfo ? (
        <>
          {!isModifyPlaylist ? (
            <div className="playlist-dropper-section">
              <div className="playlist-dropper-header">
                <h2>{playlistInfo.name}</h2>
                <ThemeProvider theme={buttomTheme}>
                  <Button
                    variant="contained"
                    size="large"
                    color="primary"
                    onClick={() => setModifyPlaylist(true)}
                  >
                    Modify Playlist
                  </Button>
                </ThemeProvider>
              </div>
              <DragDropContext onDragEnd={dragEnd}>
                <div className="playlist-dropper-zone">
                  <div className="playlist-recommended-section">
                    <h5>Recommended Songs</h5>
                    <Droppable
                      droppableId="recommended-songs"
                      direction="vertical"
                      type="column"
                    >
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="playlist-recommended-zone"
                        >
                          {recommendedSongs}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                  <div className="playist-song-section">
                    <h5>Existing Songs</h5>

                    <Droppable
                      droppableId="existingSongs"
                      direction="vertical"
                      type="column"
                    >
                      {(provided) => (
                        <div
                          className="playlist-song-zone"
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          {existingPlaylistSongs}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                </div>
              </DragDropContext>
            </div>
          ) : (
            <ModifyPlaylist
              user={user}
              spotifyApi={spotifyApi}
              playlist={playlistInfo}
            />
          )}
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
