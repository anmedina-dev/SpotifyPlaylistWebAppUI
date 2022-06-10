import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import { Outlet, Link } from "react-router-dom";
import "./Header.scss";

export default function Header(props) {
  const user = props.user;

  return (
    <div className="header-body">
      <Navbar collapseOnSelect variant="dark" sticky="top">
        <Container>
          <Navbar.Brand as={Link} to="/">
            Spotify Web App
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse
            id="responsive-navbar-nav"
            className="justify-content-lg-between"
          >
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/PlaylistCreator">
                Create Playlist
              </Nav.Link>
              <Nav.Link as={Link} to="/TopSongs">
                Your Top Songs
              </Nav.Link>
              <Nav.Link as={Link} to="/FindSong">
                Find Songs
              </Nav.Link>
            </Nav>

            <Nav>
              <Nav.Link as={Link} to="/Profile" className="profile-link">
                <img src={user.images[0].url} alt="profile_pic" />
                <div className="profile-name">{user.display_name}</div>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Outlet />
    </div>
  );
}
