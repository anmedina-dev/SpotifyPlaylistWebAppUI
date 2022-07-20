import React, { useEffect, useState } from "react";
import { decodeEntity } from "html-entities";
import "./PlaylistCard.scss";

export default function PlaylistCard(props) {
  const playlistInfo = props.playlist;
  const [playlistTitle, setPlaylistTitle] = useState("");
  const [playlistDescription, setPlaylistDescription] = useState("");
  console.log(playlistInfo);

  useEffect(() => {
    setPlaylistTitle(processWord(playlistInfo.name));
    setPlaylistDescription(processWord(playlistInfo.description));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function processWord(word) {
    const regEx = RegExp("^.*&.+;.*$");

    var tempWord = word;

    // While there a subtring in the description beginning with
    while (regEx.test(tempWord)) {
      const hexTotalWord = tempWord.substring(
        tempWord.indexOf("&"),
        tempWord.indexOf(";") + 1
      );
      const hexWord = tempWord.substring(
        tempWord.indexOf("&") + 1,
        tempWord.indexOf(";")
      );
      var asciiWord = "";

      // If it's Hex Code
      if (hexWord.charAt(0) === "#") {
        for (var i = 0; i < hexWord.length; i += 2)
          asciiWord += String.fromCharCode(parseInt(hexWord.substr(i, 2), 16));

        console.log(asciiWord);

        // If it's an HTML Entity
      } else {
        asciiWord = decodeEntity(hexTotalWord, { level: "html5" });
      }
      tempWord = tempWord.replace(hexTotalWord, asciiWord);
    }

    return tempWord;
  }

  return (
    <div onClick={props.onClick} className="playlist-card-body">
      <div className="playlist-card-meta-section">
        <h3>{playlistTitle}</h3>
        <h5>
          {playlistDescription.length > 0 ? <>{playlistDescription}</> : <></>}
        </h5>
        <h5>Track Count: {playlistInfo.tracks.total}</h5>
      </div>
      <div className="playlist-card-img-section">
        <img src={playlistInfo.images[0].url} alt="playlist-pic" />
      </div>
    </div>
  );
}
