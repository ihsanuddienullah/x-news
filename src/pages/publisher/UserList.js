import React, { useState } from "react";
import {
  Container,
  Table,
  Button,
  Row,
  Col,
  Form,
  Modal,
} from "react-bootstrap";
import { FaTrash, FaPlus, FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import { GET_ARTICLES_AND_USERS } from "../../config/graphql/Queries";
import { DELETE_AUTHOR } from "../../config/graphql/Mutations";
import { useMutation, useQuery } from "@apollo/client";
import { LoopCircleLoading } from "react-loadingg";
import swal from "sweetalert";

export default function UserList() {
  const [values, setValues] = useState("");
  const [idArticle, setIdArticle] = useState();
  const [title, setTitle] = useState("");

  const [deleteAuthor] = useMutation(DELETE_AUTHOR);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = (id, title) => {
    setShow(true);
    setIdArticle(id);
    setTitle(title);
  };

  const { loading, error, data, refetch } = useQuery(GET_ARTICLES_AND_USERS);

  if (loading) return <LoopCircleLoading className="container" color="#000" />;
  if (error) return <LoopCircleLoading className="container" color="#000" />;

  const handleChange = (event) => {
    event.persist();
    setValues(event.target.value);
  };

  async function onDelete(idUser) {
    await deleteAuthor({ variables: { id: idUser } })
    .then(async(res)=>{
      await refetch();
      handleClose();
    })
    .catch((e)=>{
      swal(
        "Delete user failed!",
        "Please try again later or contact your administrator!",
        "error"
    )})
  }

  return (
    <div id="user-list">
      <Container className="container">
        <Row className="d-flex justify-content-between mb-1">
          <Col xs={3}>
            <Button
              color="dark"
              className=""
              style={{ background: "blue" }}
              as={Link}
              to="/createuser"
              exact
            >
              <FaPlus />
            </Button>
          </Col>
          <Col md={9} lg={4} sm={9} xs={9}>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Search users"
                name="search"
                onChange={handleChange}
                value={values || ""}
              />
            </Form.Group>
          </Col>
        </Row>

        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Fullname</th>
              <th>Email</th>
              <th>Roles</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.GetAllUsers.map((items) =>
              items.fullname.toLowerCase().includes(values.toLowerCase()) ||
              items.email.toLowerCase().includes(values.toLowerCase()) ||
              items.roles.toLowerCase().includes(values.toLowerCase()) ? (
                <tr key={items.id}>
                  <td>{items.fullname}</td>
                  <td>{items.email}</td>
                  <td>{items.roles}</td>
                  <td
                    style={{ display: "flex", justifyContent: "space-around" }}
                  >
                    <Link exact to={`/edituser/${items.id}`}>
                      <Button
                        color="dark"
                        className="mr-2"
                        variant="warning"
                        as={Link}
                        to={{
                          pathname: "/edituser/" + items.id,
                          params: { items },
                          state: { detail: items}
                        }}
                        query={items}
                      >
                        <FaEdit />
                      </Button>
                    </Link>
                    <Button
                      color="dark"
                      className="mr-2"
                      variant="danger"
                      onClick={() => handleShow(items.id, items.fullname)}
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ) : (
                ""
              )
            )}
          </tbody>
        </Table>
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Delete confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure want to delete {title}?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={() => onDelete(idArticle, title)}
            >
              Yes
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
}
