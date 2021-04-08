import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";


export const SidebarData = [
  <Nav.Link as={Link} to="/dashboardreporter">
    Dashboard
  </Nav.Link>,
  <Nav.Link as={Link} to="/mynews">
    My News
  </Nav.Link>,
  <Nav.Link as={Link} to="/mydraft">
    My Draft
  </Nav.Link>,
];

export const SideBarDataPublisher = [
  <Nav.Link as={Link} to="/dashboardpublisher">
    Dashboard
  </Nav.Link>,
  <Nav.Link as={Link} to="/userlist">
    User List
  </Nav.Link>,
  <Nav.Link as={Link} to="/proposal">
    Proposal
  </Nav.Link>,
];
