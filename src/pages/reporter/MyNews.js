import React, { useState } from "react";
import {
  Row,
  Col,
  Card,
  Container,
  Button,
  Form,
  Modal,
  Nav,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import { GET_AUTHOR_ARTICLES } from "./../../config/graphql/Queries";
import { useQuery, useMutation } from "@apollo/client";
import { LoopCircleLoading } from "react-loadingg";
import { DELETE_ARTICLE } from "../../config/graphql/Mutations";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import image from "../../styles/img/image-null.png";

const MyNews = () => {
  const [values, setValues] = useState("");
  const [idArticle, setIdArticle] = useState();
  const [title, setTitle] = useState("");
  const idAuthor = localStorage.getItem("id");
  const [status, setStatus] = useState("");
  const [show, setShow] = useState(false);

  const { loading, error, data } = useQuery(GET_AUTHOR_ARTICLES, {
    variables: { id: idAuthor },
    pollInterval: 500,
  });

  const [deleteArticles] = useMutation(DELETE_ARTICLE);

  const onDelete = async (id, title) => {
    await deleteArticles({
      variables: {
        id: id,
        title: title,
      },
    });
    await swal("Delete success", `${title}`, "success");
    window.location.reload();
  };
  
  const handleClose = () => setShow(false);
  const handleShow = (id, title) => {
    setShow(true);
    setIdArticle(id);
    setTitle(title);
  };

  const rejected = "bg-danger text-white";
  const approved = "bg-success text-white";
  const waiting = "bg-secondary text-white";
  const draft = "bg-warning ";
  const statusStyle = (status) => {
    if (status === "Rejected") {
      return rejected;
    } else if (status === "Approved") {
      return approved;
    } else if (status === "Submit") {
      return waiting;
    } else if (status === "Draft") {
      return draft;
    }
  };

  if (loading) return <LoopCircleLoading className="container" color="#000" />;
  if (error) return <p className="container">Error :(</p>;

  const handleChange = (event) => {
    event.persist();
    setValues(event.target.value);
  };

  const tanggalan = (date) => {
    let tanggal = new Date(date);
    let weton = String(tanggal).slice(0, 15);
    return weton;
  };

  const newsFilter = (newsData, index) => {
    if (status === "") {
      return newsData.title.toLowerCase().includes(values.toLowerCase()) ? (
        <Col md={6} sm={12} lg={4} xs={12} key={index} className="mb-3">
          <Card className="card-shadow">
            <Card.Img
              variant="top"
              src={newsData.images !== "" ? newsData.images : image}
              style={{ maxHeight: "200px", objectFit: "cover" }}
            />
            <Card.Body>
              <Row>
                <Col lg={6} xs={5} className="text-center mb-3">
                  <Card.Text
                    style={{
                      borderRadius: "30px",
                      padding: "3px",
                      marginTop: "5px",
                    }}
                    className={statusStyle(newsData.status)}
                  >
                    {newsData.status === "Submit" ? "Waiting" : newsData.status}
                  </Card.Text>
                </Col>
                <Col
                  xl={6}
                  className="d-flex justify-content-end align-items-center mb-2"
                >
                  {tanggalan(newsData.created_at)}
                </Col>
              </Row>
              <Row>
                <Col>
                  <Card.Title style={{ fontWeight: "bolder" }}>
                    {newsData.title}
                  </Card.Title>
                </Col>
              </Row>
              <Row className="mb-2">
                {newsData.categories.map((category, index) => (
                  <Card.Text className="text-secondary ml-3 mr-0 mb-0" key={index}>
                    {category.name}
                  </Card.Text>
                ))}
              </Row>
              <Row className="mb-1">
                <Col xl={12}>
                  {/* <Card.Text>{newsData.author.fullname}</Card.Text> */}
                  {newsData.status === "Approved" ? (
                    <Row>
                      <Col
                        xl={4}
                        lg={4}
                        xs={6}
                        className="d-flex justify-content-start mb-2"
                      >
                        <FaThumbsUp color="#5EA847" />
                        <Card.Text className="ml-3">{newsData.likes}</Card.Text>
                      </Col>
                      <Col
                        xl={4}
                        lg={4}
                        xs={6}
                        className="d-flex justify-content-start mb-2"
                      >
                        <FaThumbsDown color="red" />
                        <Card.Text className="ml-3">
                          {newsData.dislikes}
                        </Card.Text>
                      </Col>
                    </Row>
                  ) : (
                    ""
                  )}
                </Col>
              </Row>
              <Row>
                {newsData.status !== "Draft" && (
                  <Col
                    lg={newsData.status === "Approved" ? 12 : 4}
                    md={newsData.status === "Approved" ? 12 : 4}
                    sm={12}
                    xl={newsData.status === "Approved" ? 12 : 4}
                    xs={12}
                    className="mb-1"
                  >
                    <Button
                      variant="primary"
                      as={Link}
                      to={{
                        pathname: "/newsdetail/" + newsData.id,
                        state: {
                          detail: newsData,
                        },
                      }}
                      style={{
                        width: "100%",
                      }}
                    >
                      Detail
                    </Button>
                  </Col>
                )}
                {newsData.status !== "Approved" && (
                  <>
                    <Col
                      lg={newsData.status === "Draft" ? 6 : 4}
                      md={newsData.status === "Draft" ? 6 : 4}
                      sm={12}
                      xl={newsData.status === "Draft" ? 6 : 4}
                      xs={12}
                      className="mb-1"
                    >
                      <Button
                        variant="warning"
                        as={Link}
                        to={{
                          pathname: "/editnews/" + newsData.id,
                          params: {
                            newsData,
                          },
                          state: {
                            detail: newsData,
                          },
                        }}
                        style={{
                          width: "100%",
                        }}
                      >
                        Edit
                      </Button>
                    </Col>
                    <Col
                      lg={newsData.status === "Draft" ? 6 : 4}
                      md={newsData.status === "Draft" ? 6 : 4}
                      sm={12}
                      xl={newsData.status === "Draft" ? 6 : 4}
                      xs={12}
                      className="mb-1"
                    >
                      <Button
                        variant="danger"
                        onClick={() => handleShow(newsData.id, newsData.title)}
                        style={{
                          width: "100%",
                        }}
                      >
                        Delete
                      </Button>
                    </Col>
                  </>
                )}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      ) : (
        ""
      );
    } else if (newsData.status === status) {
      return newsData.title.toLowerCase().includes(values.toLowerCase()) ? (
        <Col md={6} sm={12} lg={4} xs={12} key={index} className="mb-3">
          <Card className="card-shadow">
            <Card.Img
              variant="top"
              src={newsData.images !== "" ? newsData.images : image}
              style={{ maxHeight: "200px", objectFit: "cover" }}
            />
            <Card.Body>
              <Row>
                <Col lg={6} xs={5} className="text-center mb-2">
                  <Card.Text
                    style={{
                      borderRadius: "30px",
                      padding: "3px",
                    }}
                    className={statusStyle(newsData.status)}
                  >
                    {newsData.status === "Submit" ? "Waiting" : newsData.status}
                  </Card.Text>
                </Col>
                <Col
                  xl={6}
                  className="d-flex justify-content-end align-items-center mb-2"
                >
                  {tanggalan(newsData.created_at)}
                </Col>
              </Row>
              <Row>
                <Col>
                  <Card.Title style={{ fontWeight: "bolder" }}>
                    {newsData.title}
                  </Card.Title>
                </Col>
              </Row>
              <Row className="mb-2">
                {newsData.categories.map((category, index) => (
                  <Card.Text className="text-secondary ml-3 mr-0 mb-0" key={index}>
                    {category.name}
                  </Card.Text>
                ))}
              </Row>
              <Row>
                <Col>
                  {newsData.status === "Approved" ? (
                    <Row>
                      <Col
                        xl={4}
                        lg={4}
                        xs={6}
                        className="d-flex justify-content-start mb-2"
                      >
                        <FaThumbsUp color="#5EA847" />
                        <Card.Text className="ml-3">{newsData.likes}</Card.Text>
                      </Col>
                      <Col
                        xl={4}
                        lg={4}
                        xs={6}
                        className="d-flex justify-content-start mb-2"
                      >
                        <FaThumbsDown color="red" />
                        <Card.Text className="ml-3">
                          {newsData.dislikes}
                        </Card.Text>
                      </Col>
                    </Row>
                  ) : (
                    ""
                  )}
                </Col>
              </Row>
              <Row>
                {newsData.status !== "Draft" && (
                  <Col
                    lg={newsData.status === "Approved" ? 12 : 4}
                    md={newsData.status === "Approved" ? 12 : 4}
                    sm={12}
                    xl={newsData.status === "Approved" ? 12 : 4}
                    xs={12}
                    className="mb-1"
                  >
                    <Button
                      variant="primary"
                      as={Link}
                      to={{
                        pathname: "/newsdetail/" + newsData.id,
                        state: {
                          detail: newsData,
                        },
                      }}
                      style={{
                        width: "100%",
                      }}
                      block
                    >
                      Detail
                    </Button>
                  </Col>
                )}
                {newsData.status !== "Approved" && (
                  <>
                    <Col
                      lg={newsData.status === "Draft" ? 6 : 4}
                      md={newsData.status === "Draft" ? 6 : 4}
                      sm={12}
                      xl={newsData.status === "Draft" ? 6 : 4}
                      xs={12}
                      className="mb-1"
                    >
                      <Button
                        variant="warning"
                        as={Link}
                        to={{
                          pathname: "/editnews/" + newsData.id,
                          params: {
                            newsData,
                          },
                          state: {
                            detail: newsData,
                          },
                        }}
                        style={{
                          width: "100%",
                        }}
                      >
                        Edit
                      </Button>
                    </Col>
                    <Col
                      lg={newsData.status === "Draft" ? 6 : 4}
                      md={newsData.status === "Draft" ? 6 : 4}
                      sm={12}
                      xl={newsData.status === "Draft" ? 6 : 4}
                      xs={12}
                      className="mb-1"
                    >
                      <Button
                        variant="danger"
                        onClick={() => handleShow(newsData.id, newsData.title)}
                        style={{
                          width: "100%",
                        }}
                      >
                        Delete
                      </Button>
                    </Col>
                  </>
                )}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      ) : (
        ""
      );
    }
  };

  return (
    <div id="my-news">
      <Container className="container">
        <Row className="h1 mb-3">
          <Col>My News</Col>
        </Row>
        <Row>
          <Col md={2} lg={2} sm={2} xl={2} xs={12} className="mb-3">
            <Button
              variant="primary"
              style={{ width: "100%" }}
              as={Link}
              to="/createnews"
            >
              Create News
            </Button>
          </Col>
          <Col md={8} lg={8} sm={8} xl={8} xs={12}>
            <Nav>
              <Nav.Item>
                <Nav.Link eventKey="link-1" onClick={() => setStatus("")}>
                  All
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  eventKey="link-1"
                  onClick={() => setStatus("Approved")}
                >
                  Approved
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  eventKey="link-2"
                  onClick={() => setStatus("Rejected")}
                >
                  Rejected
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="link-3" onClick={() => setStatus("Submit")}>
                  Waiting
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col md={2} lg={2} sm={2} xl={2} xs={12}>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Search news"
                onChange={handleChange}
                value={values || ""}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          {data.GetAuthorArticles.map((newsData, index) =>
            newsFilter(newsData, index)
          )}
        </Row>
      </Container>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure want to delete this "{title}"?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => onDelete(idArticle, title)}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default MyNews;