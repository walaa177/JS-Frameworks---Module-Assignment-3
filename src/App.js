import "./sass/style.scss";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Home from "./components/home/Home";
import Page from "./components/pages/Page";
import Admin from "./components/admin/Admin";
import Edit from "./components/admin/Edit";
import { AuthProvider } from "./components/context/AuthContext";
function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar
          className="home-nav"
          bg="dark"
          variant="dark"
          expand="lg"
          sticky="top"
        >
          <Navbar.Brand as={Link} to="/">
            wordpress Pages
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link as={Link} to="/">
                Home
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <Switch>
          <Route path="/" exact>
            <Home />
          </Route>
          <Route path="/page">
            <Page />
          </Route>
          <Route path="/admin" exact>
            <Admin />
          </Route>
          <Route path="/admin/edit/:id">
            <Edit />
          </Route>
        </Switch>
      </Router>
    </AuthProvider>
  );
}

export default App;
