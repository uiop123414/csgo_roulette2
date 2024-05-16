import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

const Header = () => {
  let { user, logoutUser } = useContext(AuthContext);

  // return (
  //     <div>
  //         <Link to="/">Home</Link>
  //         <span> | </span>

  //         {user ? (
  //             <div>
  //                 <Link to="/roulette" >Roulette</Link>
  //                 <span> | </span>
  //                 <span onClick={logoutUser}>Logout</span>
  //             </div>
  //     )
  //         : (
  //             <Link to="/login" >Login</Link>
  //         )}
  //         {user && <p>Hello {user.username}!</p>}

  //     </div>
  // )

  return (
    <Navbar className="bg-warning" id="NavbarMain">
      <Container>
        <Navbar.Brand href="/">Home</Navbar.Brand>
        <Navbar.Toggle />
        <Nav.Link href="/games">Games</Nav.Link>
        <Nav className="me-auto">
          <Nav.Link href="/roulette">Roulette</Nav.Link>
          {user ? <Nav.Link onClick={logoutUser}>Logout</Nav.Link> : <Nav.Link href="/login">Login</Nav.Link>}
        </Nav>
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            Signed in as: <a href="/">{user && <p style={{ color: "black" }}>Hello {user.username}!</p>}</a>
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
