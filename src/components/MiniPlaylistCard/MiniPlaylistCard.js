import React, { useState, useEffect } from "react";
import { decodeEntity } from "html-entities";
import frown from "../../assets/images/frown-modified-9.png";
import "./MiniPlaylistCard.scss";

export default function MiniPlaylistCard(props) {
  const playlist = props.playlist;
  const [playlistTitle, setPlaylistTitle] = useState("");

  useEffect(() => {
    setPlaylistTitle(processWord(playlist.name));

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

        // If it's an HTML Entity
      } else {
        asciiWord = decodeEntity(hexTotalWord, { level: "html5" });
      }
      tempWord = tempWord.replace(hexTotalWord, asciiWord);
    }

    return tempWord;
  }
  return (
    <div className="mini-playlist-card-body" onClick={props.onclick}>
      <div className="playlist-card-img-section">
        {playlist.images.length > 0 ? (
          <img src={playlist.images[0].url} alt="playlist-pic" />
        ) : (
          <img src={frown} alt="playlist-pic" />
        )}
      </div>
      <div className="min-playlist-card-meta-section">
        <h3>{playlistTitle}</h3>
      </div>
    </div>
  );
}
