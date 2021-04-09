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
// import axios from "axios";
import swal from "sweetalert";
import { GET_AUTHOR_ARTICLES } from "./../../config/graphql/Queries";
import { useQuery } from "@apollo/client";
import { LoopCircleLoading } from "react-loadingg";
import { DELETE_ARTICLE } from "../../config/graphql/Mutations";
import { useMutation } from "@apollo/client";
import image from "../../styles/img/image-null.png";

const MyNews = () => {
    // const [list, setList] = useState([]);
    const [values, setValues] = useState("");
    const [idArticle, setIdArticle] = useState();
    const [title, setTitle] = useState("");
    const idAuthor = localStorage.getItem("id");
    const [status, setStatus] = useState("");
    // const token = localStorage.getItem("token");

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = (id, title) => {
        setShow(true);
        setIdArticle(id);
        setTitle(title);
    };

    const [deleteArticles] = useMutation(DELETE_ARTICLE);

    // const query = `{
    //     getAuthorArticles(id:${idAuthor}){
    //         id,
    //         title,
    //         content,
    //         likes,
    //         dislikes,
    //         status,
    //         approved_by,
    //         deleted_by,
    //         created_at,
    //         images,
    //         categories{
    //             id,
    //             name
    //         },
    //         author_id,
    //         author{
    //             id,
    //             fullname,
    //             email,
    //             roles
    //         }
    //         notes{
    //             id
    //             content
    //         }
    //     }
    // }`;

    // useEffect(() => {
    //     axios({
    //         method: "post",
    //         url: "https://xnews-development.herokuapp.com/x-news/",
    //         headers: {
    //             Authorization: `Bearer ${token}`,
    //             "Context-Type": "application/json",
    //         },
    //         data: {
    //             query,
    //         },
    //     }).then((res) => {
    //         // console.log(res);
    //         setList(res.data.data.getAuthorArticles);
    //     });
    // }, []);

    const { loading, error, data } = useQuery(GET_AUTHOR_ARTICLES, {
        variables: { id: idAuthor },
        pollInterval: 500,
    });

    if (loading)
        return <LoopCircleLoading className="container" color="#000" />;
    if (error) return <p className="container">Error :(</p>;

    // list.length === 0 && setList(data.GetAuthorArticles);

    const handleChange = (event) => {
        event.persist();
        setValues(event.target.value);
    };

    const tanggalan = (date) => {
        let tanggal = new Date(date);
        let weton = String(tanggal).slice(0, 15);
        return weton;
    };

    // const onDelete = (id, title) => {
    //     var config = {
    //         method: "post",
    //         url: `https://xnews-development.herokuapp.com/x-news/?Query=mutation+_{deleteArticles(id:${id}){id, title}}`,
    //         headers: {
    //             Authorization: `Bearer ${token}`,
    //         },
    //     };
    //     axios(config)
    //         .then(function (response) {
    //             swal("Delete success", `${title}`, "success");
    //             // console.log(response.data);
    //             window.location.reload();
    //         })
    //         .catch(function (error) {
    //             console.log(error);
    //         });
    // };

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

    const newsFilter = (newsData, index) => {
        if (status === "") {
            return newsData.title
                .toLowerCase()
                .includes(values.toLowerCase()) ? (
                <Col md={6} sm={12} lg={4} xs={12} key={index} className="mb-3">
                    <Card className="card-shadow">
                        <Card.Img
                            variant="top"
                            src={
                                newsData.images !== "" ? newsData.images : image
                            }
                            style={{ maxHeight: "200px", objectFit: "cover" }}
                        />
                        <Card.Body>
                            <Card.Title style={{ fontWeight: "bolder" }}>
                                {newsData.title}
                            </Card.Title>
                            <Row>
                                <Col>
                                    <Card.Text>
                                        {newsData.author.fullname}
                                    </Card.Text>
                                </Col>
                                <Col>{tanggalan(newsData.created_at)}</Col>
                            </Row>
                            <Row>
                                <Col
                                    lg={4}
                                    md={4}
                                    sm={12}
                                    xl={4}
                                    xs={12}
                                    className="mb-1"
                                >
                                    <Button
                                        variant="primary"
                                        as={Link}
                                        to={{
                                            pathname:
                                                "/newsdetail/" + newsData.id,
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
                                {newsData.status !== "Approved" && (
                                    <>
                                        <Col
                                            lg={4}
                                            md={4}
                                            sm={12}
                                            xl={4}
                                            xs={12}
                                            className="mb-1"
                                        >
                                            <Button
                                                variant="warning"
                                                as={Link}
                                                to={{
                                                    pathname:
                                                        "/editnews/" +
                                                        newsData.id,
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
                                            lg={4}
                                            md={4}
                                            sm={12}
                                            xl={4}
                                            xs={12}
                                            className="mb-1"
                                        >
                                            <Button
                                                variant="danger"
                                                onClick={() =>
                                                    handleShow(
                                                        newsData.id,
                                                        newsData.title
                                                    )
                                                }
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
            return newsData.title
                .toLowerCase()
                .includes(values.toLowerCase()) ? (
                <Col md={6} sm={12} lg={4} xs={12} key={index} className="mb-3">
                    <Card className="card-shadow">
                        <Card.Img
                            variant="top"
                            src={
                                newsData.images !== "" ? newsData.images : image
                            }
                            style={{ maxHeight: "200px", objectFit: "cover" }}
                        />
                        <Card.Body>
                            <Card.Title style={{ fontWeight: "bolder" }}>
                                {newsData.title}
                            </Card.Title>
                            <Row>
                                <Col>
                                    <Card.Text>
                                        {newsData.author.fullname}
                                    </Card.Text>
                                </Col>
                                <Col>{tanggalan(newsData.created_at)}</Col>
                            </Row>
                            <Row>
                                <Col
                                    lg={4}
                                    md={4}
                                    sm={12}
                                    xl={4}
                                    xs={12}
                                    className="mb-1"
                                >
                                    <Button
                                        variant="primary"
                                        as={Link}
                                        to={{
                                            pathname:
                                                "/newsdetail/" + newsData.id,
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
                                {newsData.status !== "Approved" && (
                                    <>
                                        <Col
                                            lg={4}
                                            md={4}
                                            sm={12}
                                            xl={4}
                                            xs={12}
                                            className="mb-1"
                                        >
                                            <Button
                                                variant="warning"
                                                as={Link}
                                                to={{
                                                    pathname:
                                                        "/editnews/" +
                                                        newsData.id,
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
                                            lg={4}
                                            md={4}
                                            sm={12}
                                            xl={4}
                                            xs={12}
                                            className="mb-1"
                                        >
                                            <Button
                                                variant="danger"
                                                onClick={() =>
                                                    handleShow(
                                                        newsData.id,
                                                        newsData.title
                                                    )
                                                }
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
                                <Nav.Link
                                    eventKey="link-1"
                                    onClick={() => setStatus("")}
                                >
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
                                <Nav.Link
                                    eventKey="link-3"
                                    onClick={() => setStatus("Submit")}
                                >
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
                <Modal.Body>
                    Are you sure want to delete this "{title}"?
                </Modal.Body>
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
        </div>
    );
};
export default MyNews;
