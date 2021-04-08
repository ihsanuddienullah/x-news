import React from "react";
import useLogin from "./useLogin";
import validasi from "./validasiLogin";
import { Button, Card, Container, Figure, Form, Row, Col } from "react-bootstrap";
import logo from "../../styles/img/x-news1.svg";
import DashboardReporter from "../reporter/DashboardReporter";
import DashboardPublisher from "../publisher/DashboardPublisher";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import swal from "sweetalert";

export default function Login() {
  const {
    values,
    errors,
    history,
    // message,
    handlingChange,
    handleFormSubmit,
  } = useLogin(berhasil, validasi);

  const [display, setDisplay] = useState (false)
  const [eye, setEye] = useState (true)
  
  const displayPassword = () => {
    if(display===false){
      setDisplay(true)
      setEye(false)
    } else {
      setDisplay(false)
      setEye(true)
    }
  };
  
  async function berhasil() {
    const name= localStorage.getItem('name')
    const roles = localStorage.getItem("roles");
    await swal("Login Success!", `Welcome aboard, ${name}!`, "success");
    if (roles === "author") {
      history.push("/dashboardreporter");
    } else if (roles === "publisher") {
      history.push("/dashboardpublisher");
    }
    window.location.reload();
  }

  const roles = localStorage.getItem("roles");

  if (roles === "author") {
    return <DashboardReporter />;
  } else if (roles === "publisher") {
    return <DashboardPublisher />;
  } else {
    return (
      <div id="login">
        <Container className="container-login container">
          <Figure>
            <Figure.Image
              src={logo}
              width={171}
              height={180}
              className="mb-4 mt-5"
            />
          </Figure>
          <Card style={{ borderRadius: "20px" }} className="card-shadow">
            <Card.Title
              style={{ textAlign: "center", fontSize: "40px" }}
              className="mb-4 mt-4"
            >
              Login
            </Card.Title>
            <Form
              style={{ padding: "20px 20px", borderRadius: "20px" }}
              onSubmit={handleFormSubmit}
            >
              <Form.Group controlId="formBasicEmail">
                <Form.Control
                  type="text"
                  size="lg"
                  name="email"
                  placeholder="Email"
                  value={values.email || ""}
                  style={{ borderRadius: "10px" }}
                  onChange={handlingChange}
                />
                <Form.Text style={{ color: "red" }}>{errors.email}</Form.Text>
              </Form.Group>
              <Form.Group controlId="formBasicPassword">
                <Row>
                  <Col lg={10} xs={10} >
                    <Form.Control
                      type={display? "text":"password"}
                      size="lg"
                      name="password"
                      placeholder="Password"
                      value={values.password || ""}
                      style={{ borderRadius: "10px" }}
                      onChange={handlingChange}
                    >
                    </Form.Control>
                  </Col>
                  <Col lg={2} xs={2} className='d-flex align-items-center justify-content-end'>
                    <Button onClick={displayPassword} style={{background:'none', border:'none', color:'black'}}>
                      {eye===false? <FaEye className='fa fa-spin' />: <FaEyeSlash />}
                    </Button>
                  </Col>
                </Row>
                <Form.Text style={{ color: "red" }}>
                  {errors.password}
                </Form.Text>
                {/* <Form.Text style={{ color: "red" }}>
                  {message ? "" : "Wrong email or password. Try Again!"}
                </Form.Text> */}
              </Form.Group>

              <Button
                type="submit"
                size="lg"
                style={{ background: "#2F90E0", borderRadius: "10px" }}
                block
              >
                LOGIN
              </Button>
            </Form>
          </Card>
        </Container>
      </div>
    );
  }
}
