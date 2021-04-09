import React, { useState } from "react";
import { Container, Button, Form, Card } from "react-bootstrap";
// import axios from "axios";
import swal from "sweetalert";
import {CREATE_AUTHOR} from '../../config/graphql/Mutations'
import {useMutation} from '@apollo/client'

export default function CreateUser() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [createAuthor] = useMutation(CREATE_AUTHOR)

  const handleChangeName = (e) => {
    setFullName(e.target.value);
  };
  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
  };
  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };

  // const token = localStorage.getItem("token");
  async function onCreateSubmit (e) {
    e.preventDefault();
    await createAuthor({variables:{email: email, password: password, fullname: fullName}})
    await swal("Users Created", `${fullName}`, "success")
    window.location.assign('/userlist')
    // window.location.assign('/userlist')
    // var config = {
    //   method: "post",
    //   url: `https://xnews-development.herokuapp.com/x-news/?Query=mutation+_{createAuthor(email:"${email}", password:"${password}", fullname:"${fullName}"){id,email, fullname, roles}}`,
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //   },
    // };

    // axios(config)
    //   .then(function (response) {
    //     console.log(JSON.stringify(response.data));
    //     window.location.assign("/userlist");
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //   });
  };
  
  return (
    <div id="login">
      <Container className="container-login container">
        <Card style={{ borderRadius: "20px" }} className="card-shadow">
          <Card.Title
            style={{ textAlign: "center", fontSize: "40px" }}
            className="mb-4 mt-4"
          >
            Create User
          </Card.Title>
          <Form
            style={{ padding: "20px 20px", borderRadius: "20px" }}
            onSubmit={onCreateSubmit}
          >
            <Form.Group controlId="formBasicEmail">
              <Form.Control
                type="text"
                size="lg"
                name="email"
                placeholder="Email"
                style={{ borderRadius: "10px" }}
                onChange={handleChangeEmail}
              />
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Control
                type="password"
                size="lg"
                name="password"
                placeholder="Password"
                style={{ borderRadius: "10px" }}
                onChange={handleChangePassword}
              />
            </Form.Group>
            <Form.Group controlId="formBasicName">
              <Form.Control
                type="text"
                size="lg"
                name="fullname"
                placeholder="Full Name"
                style={{ borderRadius: "10px" }}
                onChange={handleChangeName}
              />
            </Form.Group>

            <Button
              type="submit"
              size="lg"
              style={{ background: "#2F90E0", borderRadius: "10px" }}
              block
            >
              SUBMIT
            </Button>
          </Form>
        </Card>
      </Container>
    </div>
  );
}
