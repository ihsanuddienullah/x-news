import React, { useState } from "react";
import {
  Nav,
  Navbar,
  Row,
  Col,
  Popover,
  OverlayTrigger,
} from "react-bootstrap";
import SideNav, { MenuIcon } from "react-simple-sidenav";
import { SidebarData, SideBarDataPublisher } from "./SidebarData";
import { FaSignOutAlt, FaRegBell } from "react-icons/fa";
import { useHistory } from "react-router-dom";
import logo from "../../../styles/img/x-news2.svg";

const HeaderSidebar = () => {
  const [showNav, setShowNav] = useState();
  let history = useHistory();

  const clearStorage = () => {
    localStorage.clear();
    history.push("/");
    window.location.reload();
  };

  const roles = localStorage.getItem("roles");

  const notifikasi = (
    <Popover id="popover-basic">
      <Popover.Title as="h3">Notification</Popover.Title>
      <Popover.Content>
        {roles === "publisher"
          ? "Ihsan submitted a new article."
          : "Your article has been rejected"}
      </Popover.Content>
      <Popover.Content>
        {roles === "publisher"
          ? "Ihsan submitted a new article."
          : "Your article has been rejected"}
      </Popover.Content>
    </Popover>
  );

  const logoXnews = (
    <img src={logo} style={{ width: "100%" }} alt="xnews-logo" />
  );

  return (
    <div id="header">
      {localStorage.getItem("email") !== undefined &&
      localStorage.getItem("email") !== null ? (
        <>
          <Navbar
            expand="lg"
            bg="dark"
            variant="dark"
            fixed="top"
            style={{ zIndex: "1000" }}
          >
            <Navbar.Brand href="">
              <MenuIcon onClick={() => setShowNav(true)} />
            </Navbar.Brand>
            <Nav className="ml-auto justify-content-end">
              <Row>
                <OverlayTrigger
                  trigger="click"
                  placement="bottom"
                  overlay={notifikasi}
                >
                  <Col>
                    <Nav.Item>
                      <Nav.Link href="">
                        <FaRegBell />
                      </Nav.Link>
                    </Nav.Item>
                  </Col>
                </OverlayTrigger>
                <Col>
                  <Nav.Item>
                    <Nav.Link onClick={clearStorage}>
                      <FaSignOutAlt />
                    </Nav.Link>
                  </Nav.Item>
                </Col>
              </Row>
            </Nav>
          </Navbar>

          <SideNav
            showNav={showNav}
            onHideNav={() => setShowNav(false)}
            title={logoXnews}
            items={
              roles === "author"
                ? SidebarData.map((menu) => {
                    return menu;
                  })
                : SideBarDataPublisher.map((menu) => {
                    return menu;
                  })
            }
            titleStyle={{ backgroundColor: "#FFF" }}
            itemStyle={{ backgroundColor: "#fff" }}
            itemHoverStyle={{ backgroundColor: "#405161" }}
            style={{ zIndex: "1001" }}
          />
        </>
      ) : (
        " "
      )}
    </div>
  );
};

export default HeaderSidebar;
