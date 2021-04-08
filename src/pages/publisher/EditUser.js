import React, { useState } from "react";
import { Button, Form, Container, Card } from "react-bootstrap";
import axios from "axios";
import swal from "sweetalert";
import {useMutation} from '@apollo/client';
import {UPDATE_USER} from '../../config/graphql/Mutations'

export default function EditUser(props) {
    const [fullName, setFullName] = useState(props.location.state.detail.fullname);
    const idUser = props.location.state.detail.id;
    const [updateUser] = useMutation(UPDATE_USER)
    console.log(props);
    const handleChangeName = (e) => {
        setFullName(e.target.value);
    };

    // let config = {
    //     method: "post",
    //     url: `https://xnews-development.herokuapp.com/x-news/?Query=mutation+_{updateUser(id:${idUser},fullname:"${fullName}"){id,email, fullname}}`,
    //     headers: {
    //         Authorization: `Bearer ${token}`,
    //     },
    // };

    async function updateAuthor (e) {
        e.preventDefault();
        await updateUser({variables:{id:idUser, fullname: fullName}})
        await swal("Users Edited", `${fullName}`, "success");
        window.location.assign('/userlist')
        // axios(config)
        //     .then(function (response) {
        //         console.log(JSON.stringify(response.data));
        //         window.location.assign("/userlist");
        //     })
        //     .catch(function (error) {
        //         console.log(error);
        //     });
    };

  return (
    <div id="login">
      <Container className="container-login container">
        <Card style={{ borderRadius: "20px" }} className="card-shadow">
          <Card.Title
            style={{ textAlign: "center", fontSize: "40px" }}
            className="mb-4 mt-4"
          >
            Edit User
          </Card.Title>
          <Form
            style={{ padding: "20px 20px", borderRadius: "20px" }}
            onSubmit={updateAuthor}
          >
            <Form.Group controlId="formBasicName">
              <Form.Control
                type="text"
                size="lg"
                name="fullname"
                placeholder="Full Name"
                style={{ borderRadius: "10px" }}
                onChange={handleChangeName}
                autoComplete='off'
                value={fullName}
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
