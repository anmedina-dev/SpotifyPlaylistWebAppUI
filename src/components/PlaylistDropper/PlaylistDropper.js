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
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <SortableContext
      id={id}
      items={playlists}
      strategy={verticalListSortingStrategy}
    >
      <div ref={setNodeRef} className="sortable-context">
        {playlists.map((id) => (
          <SongCard key={id.id} popularity={false} song={id} />
        ))}
      </div>
    </SortableContext>
  );
}

export default function PlaylistDropper(props) {
  const playlistTitle = props.title;
  const spotifyApi = props.spotifyApi;
  const user = props.user;

  const [playlistInfo, setPlaylistInfo] = useState({});
  const [isModifyPlaylist, setModifyPlaylist] = useState(false);

  const [uniqueArtists, setUniqueArtists] = useState([]);
  const [activeId, setActiveId] = useState();

  const [showContainers, setShowContainers] = useState(false);
  const [isLikedSongs, setIsLikedSongs] = useState(false);

  // Song playlists
  const [playlists, setPlaylists] = useState({
    existingPlaylistSongs: [],
    recommendedSongs: [],
  });

  const [exisitingPlaylistPlaceholder, setExistingPlaylistPlaceholder] =
    useState([]);

  const [playlistId, setPlaylistId] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    spotifyApi.getUserPlaylists(user.id).then(
      function (data) {
        const exactPlaylist = data.body.items.filter(
          (playlist) => playlist.name === playlistTitle
        );

        // Get playlist songs
        spotifyApi.getPlaylist(exactPlaylist[0].id).then(
          function (data) {
            // Set Playlist Id on load
            setPlaylistId(exactPlaylist[0].id);
            // Get playlist on load
            console.log("Some information about this playlist", data.body);
            setPlaylistInfo(data.body);
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

  useEffect(() => {
    if (
      playlists.existingPlaylistSongs.length > 0 &&
      playlists.recommendedSongs.length > 0
    ) {
      setShowContainers(true);
      return;
    }
    if (isLikedSongs && playlists.recommendedSongs.length > 0) {
      setShowContainers(true);
      return;
    }
    setIsLikedSongs(false);
    setShowContainers(false);
  }, [playlists]);

  // Any time a new playlist is chosen update the songs in the columns
  useEffect(() => {
    // If playlist doesn't exist
    if (uniqueArtists.length < 0) {
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

          tempRecommendedPlaylist = data.body.tracks;

          const tempExistPlaylist = [];
          // Get songs from existing playlist

          playlistInfo.tracks.items.forEach((song) => {
            tempExistPlaylist.push(song.track);
          });

          setPlaylists((playlists) => ({
            ...playlists,
            existingPlaylistSongs: tempExistPlaylist,
            recommendedSongs: tempRecommendedPlaylist,
          }));
          setExistingPlaylistPlaceholder(tempExistPlaylist);
        },
        function (err) {
          console.log("Something went wrong!", err);
        }
      );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uniqueArtists]);

  useEffect(() => {
    // If playlist doesn't exist
    if (Object.keys(playlistInfo).length === 0) {
      return;
    }

    let songs = [];
    console.log(playlistInfo);
    const tempSongs = playlistInfo.tracks.items;
    const artists = [];

    // console.log(tempSongs);
    if (tempSongs < 1) {
      /* Get a User’s Top Tracks*/
      spotifyApi.getMyTopTracks().then(
        function (data) {
          songs = data.body.items;
          songs.forEach((song) => {
            const subArtists = song.artists;
            subArtists.forEach((subArtist) => {
              artists.push(subArtist.id);
            });
          });
          console.log(songs);
          console.log(artists);
          setIsLikedSongs(true);

          // Finding first 5 Unique Arists in playlist
          let tempArtists = [...new Set(artists)];
          tempArtists = tempArtists.slice(0, 5);

          console.log(tempArtists);
          setUniqueArtists(tempArtists);
        },
        function (err) {
          console.log("Something went wrong!", err);
        }
      );
    } else {
      songs = tempSongs;
      songs.forEach((song) => {
        const subArtists = song.track.artists;
        subArtists.forEach((subArtist) => {
          artists.push(subArtist.id);
        });
      });

      // Finding first 5 Unique Arists in playlist
      let tempArtists = [...new Set(artists)];
      tempArtists = tempArtists.slice(0, 5);

      console.log(tempArtists);
      setUniqueArtists(tempArtists);
    }
  }, [playlistInfo]);

  useEffect(() => {
    if (exisitingPlaylistPlaceholder.length < 1) return;

    setExistingPlaylistPlaceholder(playlists.existingPlaylistSongs);

    // removing songs
    let difference = exisitingPlaylistPlaceholder.filter(
      (x) => !playlists.existingPlaylistSongs.includes(x)
    );

    if (difference.length > 0) {
      spotifyApi.removeTracksFromPlaylist(playlistId, difference);
    }

    // adding songs
    difference = playlists.existingPlaylistSongs.filter(
      (x) => !exisitingPlaylistPlaceholder.includes(x)
    );

    if (difference.length > 0) {
      const uriArray = [];

      for (let x in difference) {
        uriArray.push(difference[x].uri);
      }

      spotifyApi.addTracksToPlaylist(playlistId, uriArray);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playlists.existingPlaylistSongs]);

  function findContainer(id) {
    if (id in playlists) {
      return id;
    }

    return Object.keys(playlists).find((key) =>
      playlists[key].includes(playlists[key].find((obj) => obj.id === id))
    );
  }

  function handleDragStart(event) {
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
    const { active, over } = event;
    const { id } = active;
    const { id: overId } = over;

    // Find the containers
    const activeContainer = findContainer(id);
    const overContainer = findContainer(overId);

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
          active.rect.offsetTop > over.rect.offsetTop + over.rect.height;

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
    const { active, over } = event;
    const { id } = active;
    const { id: overId } = over;

    const activeContainer = findContainer(id);
    const overContainer = findContainer(overId);

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
                {showContainers && (
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
                        <Container
                          id="container-1"
                          playlists={playlists.recommendedSongs}
                        />
                      </div>
                    </div>
                    <div className="playist-song-section">
                      <h5>Existing Songs</h5>
                      <div className="playlist-song-zone">
                        <Container
                          id="container-2"
                          playlists={playlists.existingPlaylistSongs}
                        />
                      </div>
                    </div>
                    <DragOverlay>
                      {activeId ? (
                        <SongCard
                          popularity={false}
                          key={activeId.id}
                          song={activeId}
                          className="drag-songcard"
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
}
