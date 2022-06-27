import React from "react";
import "./LandingPage.scss";

export default function LandingPage(props) {
  const user = props.user;
  console.log(user);

  return (
    <div className="landing-page-body">
      <div className="landing-page-header-section">
        <h2>Welcome {user.display_name}!</h2>
      </div>
    </div>
  );
}
