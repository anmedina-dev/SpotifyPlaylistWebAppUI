import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@emotion/react";
import {
  DndContext,
  useDroppable,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  sortableKeyboardCoordinates,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import ModifyPlaylist from "../ModifyPlaylist";
import "./PlaylistDropper.scss";
import SongCard from "../SongCard";

const buttomTheme = createTheme({
  palette: {
    primary: {
      main: "#964B00",
    },
  },
});

export function Container(props) {
  const { id, playlists } = props;
  // console.log(playlists);

  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <SortableContext
      id={id}
      items={playlists}
      strategy={verticalListSortingStrategy}
    >
      <div ref={setNodeRef}>
        {playlists.map((id) => (
          <SongCard key={id.id} popularity={false} song={id} />
        ))}
      </div>
    </SortableContext>
  );
}

const defaultAnnouncements = {
  onDragStart(id) {
    console.log(`Picked up draggable item ${id.id}.`);
  },
  onDragOver(id, overId) {
    if (overId) {
      console.log(
        `Draggable item ${id.id} was moved over droppable area ${overId.id}.`
      );
      return;
    }

    console.log(`Draggable item ${id.id} is no longer over a droppable area.`);
  },
  onDragEnd(id, overId) {
    if (overId.id) {
      console.log(
        `Draggable item ${id.id} was dropped over droppable area ${overId.id}`
      );
      return;
    }

    console.log(`Draggable item ${id.id} was dropped.`);
  },
  onDragCancel(id) {
    console.log(`Dragging was cancelled. Draggable item ${id.id} was dropped.`);
  },
};

export default function PlaylistDropper(props) {
  const playlistTitle = props.title;
  const spotifyApi = props.spotifyApi;
  const user = props.user;

  const [playlistInfo, setPlaylistInfo] = useState({});
  const [isModifyPlaylist, setModifyPlaylist] = useState(false);

  const [uniqueArtists, setUniqueArtists] = useState();
  const [activeId, setActiveId] = useState();

  // Song playlists
  const [playlists, setPlaylists] = useState({
    existingPlaylistSongs: [],
    recommendedSongs: [],
  });

  /*
  const [existingPlaylistSongs, setExistingPlaylistSongs] = useState([]);
  const [recommendedSongs, setRecommendedSongs] = useState([]);
*/
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    spotifyApi.getUserPlaylists(user.id).then(
      function (data) {
        console.log(data);
        const exactPlaylist = data.body.items.filter(
          (playlist) => playlist.name === playlistTitle
        );

        // Get playlist songs
        spotifyApi.getPlaylist(exactPlaylist[0].id).then(
          function (data) {
            // Get playlist on load
            console.log("Some information about this playlist", data.body);

            const songs = data.body.tracks.items;
            //console.log(songs);
            const artists = [];
            songs.forEach((song) => {
              const subArtists = song.track.artists;
              subArtists.forEach((subArtist) => {
                artists.push(subArtist.id);
              });
            });

            // Finding first 5 Unique Arists in playlist
            let tempArtists = [...new Set(artists)];
            tempArtists = tempArtists.slice(0, 5);
            setUniqueArtists(tempArtists);
            setPlaylistInfo(data.body);
            // console.log(tempArtists);
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

  // Any time a new playlist is chosen update the songs in the columns
  useEffect(() => {
    // If playlist doesn't exist
    if (Object.keys(playlistInfo).length === 0) {
      return;
    }

    let tempRecommendedPlaylist = [];
    // Get Recommendations Based on Seeds and first 5 Unique Artists from existing playlist
    spotifyApi
      .getRecommendations({
        min_energy: 0.7,
        seed_artists: uniqueArtists,
        min_popularity: 20,
      })
      .then(
        function (data) {
          // let recommendations = data.body;
          console.log(data.body.tracks);
          tempRecommendedPlaylist = data.body.tracks;

          /*
          setPlaylists((playlists) => ({
            ...playlists,
            recommendedSongs: data.body.tracks,
          }));
          */
          // setRecommendedSongs(data.body.tracks);

          const tempExistPlaylist = [];
          // Get songs from existing playlist
          console.log(playlistInfo);
          playlistInfo.tracks.items.forEach((song) => {
            tempExistPlaylist.push(song.track);
          });

          console.log(tempExistPlaylist);
          setPlaylists((playlists) => ({
            ...playlists,
            existingPlaylistSongs: tempExistPlaylist,
            recommendedSongs: tempRecommendedPlaylist,
          }));
        },
        function (err) {
          console.log("Something went wrong!", err);
        }
      );
    // setExistingPlaylistSongs(tempExistPlaylist);
    // console.log(existingPlaylistSongs);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playlistInfo, uniqueArtists]);

  useEffect(() => {
    console.log("activeID: ", activeId);
  }, [activeId]);

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

              <div className="playlist-dropper-zone">
                {playlists.existingPlaylistSongs.length > 0 &&
                  playlists.recommendedSongs.length > 0 && (
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCorners}
                      onDragStart={handleDragStart}
                      onDragOver={handleDragOver}
                      onDragEnd={handleDragEnd}
                    >
                      <div className="playlist-recommended-section">
                        <h5>Recommended Songs</h5>

                        <div className="playlist-recommended-zone">
                          {playlists.recommendedSongs.length > 0 ? (
                            <Container
                              id="container-1"
                              playlists={playlists.recommendedSongs}
                            />
                          ) : (
                            <></>
                          )}
                        </div>
                      </div>
                      <div className="playist-song-section">
                        <h5>Existing Songs</h5>
                        <div className="playlist-song-zone">
                          {playlists.existingPlaylistSongs.length > 0 ? (
                            <Container
                              id="container-2"
                              playlists={playlists.existingPlaylistSongs}
                            />
                          ) : (
                            <></>
                          )}
                        </div>
                      </div>
                      <DragOverlay>
                        {activeId ? (
                          <SongCard
                            popularity={false}
                            key={activeId.id}
                            song={activeId}
                          />
                        ) : null}
                      </DragOverlay>
                    </DndContext>
                  )}
              </div>
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

  function findContainer(id) {
    if (id in playlists) {
      return id;
    }

    return Object.keys(playlists).find((key) =>
      playlists[key].includes(playlists[key].find((obj) => obj.id === id))
    );
  }

  function handleDragStart(event) {
    console.log(event);
    const { active } = event;
    const { id } = active;

    let tempSongPlaylist = "";
    if ((active.data.current.sortable.containerId = "container-1")) {
      tempSongPlaylist = "recommendedSongs";
    } else {
      tempSongPlaylist = "existingPlaylistSongs";
    }
    const songItem = playlists[tempSongPlaylist].find((obj) => obj.id === id);

    setActiveId(songItem);
  }

  function handleDragOver(event) {
    const { active, over, draggingRect } = event;
    const { id } = active;
    const { id: overId } = over;

    // Find the containers
    const activeContainer = findContainer(id);
    const overContainer = findContainer(overId);

    console.log(activeContainer);
    console.log(overContainer);

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer === overContainer
    ) {
      return;
    }

    setPlaylists((prev) => {
      const activeplaylists = prev[activeContainer];
      const overplaylists = prev[overContainer];

      // Find the indexes for the playlists
      const activeIndex = activeplaylists.indexOf(
        playlists[activeContainer].find((obj) => obj.id === active.id)
      );
      const overIndex = overplaylists.indexOf(
        playlists[overContainer].find((obj) => obj.id === overId)
      );

      let newIndex;
      if (overId in prev) {
        // We're at the root droppable of a container
        newIndex = overplaylists.length + 1;
      } else {
        const isBelowLastItem =
          over &&
          overIndex === overplaylists.length - 1 &&
          draggingRect.offsetTop > over.rect.offsetTop + over.rect.height;

        const modifier = isBelowLastItem ? 1 : 0;

        newIndex =
          overIndex >= 0 ? overIndex + modifier : overplaylists.length + 1;
      }

      return {
        ...prev,
        [activeContainer]: [
          ...prev[activeContainer].filter(
            (item) =>
              item !==
              playlists[activeContainer].find((obj) => obj.id === active.id)
          ),
        ],
        [overContainer]: [
          ...prev[overContainer].slice(0, newIndex),
          playlists[activeContainer][activeIndex],
          ...prev[overContainer].slice(newIndex, prev[overContainer].length),
        ],
      };
    });
  }

  function handleDragEnd(event) {
    console.log(event);
    const { active, over } = event;
    const { id } = active;
    const { id: overId } = over;

    const activeContainer = findContainer(id);
    const overContainer = findContainer(overId);

    // console.log(activeContainer);
    // console.log(overContainer);

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer !== overContainer
    ) {
      return;
    }

    const activeIndex = playlists[activeContainer].indexOf(
      playlists[activeContainer].find((obj) => obj.id === active.id)
    );
    const overIndex = playlists[overContainer].indexOf(
      playlists[overContainer].find((obj) => obj.id === overId)
    );

    // console.log(activeIndex);
    // console.log(overIndex);

    if (activeIndex !== overIndex) {
      setPlaylists((playlists) => ({
        ...playlists,
        [overContainer]: arrayMove(
          playlists[overContainer],
          activeIndex,
          overIndex
        ),
      }));
    }

    setActiveId(null);
  }
}
