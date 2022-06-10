import React from "react";
import "./Profile.scss";

export default function Profile(props) {
  const user = props.user;
  return (
    <div className="profile-body">
      <div className="profile-title-section">
        <img src={user.images[0].url} alt="profile_pic" />
        <h2>{user.display_name}</h2>
      </div>
      <div className="profile-sub-title-section">
        <div>id: {user.id}</div>
        <div>followers: {user.followers.total}</div>
        <div>
          <a target="_blank" href={user.external_urls.spotify} rel="noreferrer">
            Spotify Profile
          </a>
        </div>
      </div>
    </div>
  );
}
