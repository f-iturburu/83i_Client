import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Image from "react-bootstrap/Image";
import { Button } from "react-bootstrap";
import { getLs } from "../helpers/getLs";
import Logo from "../assets/logo.png";

const USER_KEY = import.meta.env.VITE_USER_KEY;
const ADMIN_KEY = import.meta.env.VITE_ADMIN_KEY;

function Navigation() {
  const token = getLs("auth-token");
  const key = getLs("key");

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary w-100">
      <Container className="mx-3 w-100">
        <Navbar.Brand href="/">
          <Image className="img-fluid w-25" src={Logo}></Image>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="w-100">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link
              href="https://rollingcode.co/#RollingCodeLabs"
              target="_blank"
            >
              Studio
            </Nav.Link>
            <Nav.Link
              href="https://rollingcode.co/#RollingCodeStudio"
              target="_blank"
            >
              School
            </Nav.Link>
            <Nav.Link
              href="https://rollingcode.co/#RollingCodeSchool"
              target="_blank"
              className="me-auto"
            >
              Sobre Nosotros
            </Nav.Link>

        { token ? "" :  <>
        
        <Nav.Link href="/login">
              Ingresar <i className="bi bi-box-arrow-in-right"></i>
            </Nav.Link>

            <Nav.Link href="/signUp">
              Registrarse <i className="bi bi-person-add"></i>
            </Nav.Link> </> }

         { key == ADMIN_KEY ? <Nav.Link href="/admin">
              Admin <i className="bi bi-wrench"></i>
            </Nav.Link> : ""}

          { token ? <Nav.Link>
              <Button variant="" onClick={logout}>
                Cerrar sesión <i className="bi bi-box-arrow-in-left"></i>{" "}
              </Button>
            </Nav.Link> : ""}

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;
