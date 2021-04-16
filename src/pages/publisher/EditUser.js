import React, { useState } from "react";
import { Button, Form, Container, Card } from "react-bootstrap";
import swal from "sweetalert";
import {useMutation} from '@apollo/client';
import {UPDATE_USER} from '../../config/graphql/Mutations'

export default function EditUser(props) {
    const [fullName, setFullName] = useState(props.location.state.detail.fullname);
    const idUser = props.location.state.detail.id;
    const [updateUser] = useMutation(UPDATE_USER)
    const handleChangeName = (e) => {
        setFullName(e.target.value);
    };

    async function updateAuthor (e) {
        e.preventDefault();
        await updateUser({variables:{id:idUser, fullname: fullName}})
        .then(async(res)=>{
          await swal("Users Edited", `${fullName}`, "success");
          window.location.assign('/userlist')
        })
        .catch((err)=>{
          swal(
            "Edit username failed!",
            "Please try again later or contact your administrator!",
            "error"
        )})
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
