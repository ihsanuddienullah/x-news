import React, { useState } from "react";
import {
    Row,
    Col,
    Card,
    Container,
    Button,
    Form,
    Modal,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import { GET_AUTHOR_ARTICLES } from "./../../config/graphql/Queries";
import { useQuery } from "@apollo/client";
import { LoopCircleLoading } from "react-loadingg";
import { DELETE_ARTICLE } from "../../config/graphql/Mutations";
import { useMutation } from "@apollo/client";
import image from "../../styles/img/image-null.png";

const MyNews = () => {
    const [list, setList] = useState([]);
    const [values, setValues] = useState("");
    const [idArticle, setIdArticle] = useState();
    const [title, setTitle] = useState("");
    const idAuthor = localStorage.getItem("id");    

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = (id, title) => {
        setShow(true);
        setIdArticle(id);
        setTitle(title);
    };

    const [deleteArticles] = useMutation(DELETE_ARTICLE);
    const { loading, error, data } = useQuery(GET_AUTHOR_ARTICLES, {
        variables: { id: idAuthor },
        pollInterval: 300,
    });

    if (loading)
        return <LoopCircleLoading className="container" color="#000" />;
    if (error) return <p className="container">Error :(</p>;

    list.length === 0 && setList(data.GetAuthorArticles);

    const handleChange = (event) => {
        event.persist();
        setValues(event.target.value);
    };

    const tanggalan = (date) => {
        let tanggal = new Date(date);
        let weton = String(tanggal).slice(0, 15);
        return weton;
    };

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

    return (
        <div id="my-draft">
            <Container className="container">
                <Row className="h1 mb-3">
                    <Col>My Drafts</Col>
                </Row>
                <Row>
                    <Col md={2} lg={2} sm={2} xl={2} xs={12} className="mb-3">
                        <Button
                            variant="primary"
                            as={Link}
                            to="/createnews"
                            style={{ width: "100%" }}
                        >
                            Create News
                        </Button>
                    </Col>
                    <Col md={8} lg={8} sm={8} xl={8} xs={12}></Col>
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
                    {list.map(
                        (newsData, index) =>
                            newsData.status === "Draft" &&
                            (newsData.title
                                .toLowerCase()
                                .includes(values.toLowerCase()) ? (
                                <Col
                                    md={6}
                                    sm={12}
                                    lg={4}
                                    xs={12}
                                    key={index}
                                    className="mb-3"
                                >
                                    <Card className="card-shadow">
                                        <Card.Img
                                            variant="top"
                                            src={
                                                newsData.images !== ""
                                                    ? newsData.images
                                                    : image
                                            }
                                            style={{
                                                maxHeight: "200px",
                                                objectFit: "cover",
                                            }}
                                            />
                                        <Card.Body>
                                            <Row>
                                            <Col>
                                                {tanggalan(
                                                    newsData.created_at
                                                )}
                                            </Col>
                                            </Row>
                                            <Card.Title
                                                style={{ fontWeight: "bolder" }}
                                            >
                                                {newsData.title}
                                            </Card.Title>
                                            <Row className='mb-2'>
                                            {newsData.categories.map((category) => (
                                                <Card.Text
                                                    className="text-secondary ml-3 mr-0 mb-0"
                                                >
                                                    {category.name}
                                                </Card.Text>
                                                ))}
                                            </Row>
                                            
                                            <Row>
                                                
                                                <Col
                                                    lg={6}
                                                    md={6}
                                                    sm={12}
                                                    xl={6}
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
                                                    lg={6}
                                                    md={6}
                                                    sm={12}
                                                    xl={6}
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
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ) : (
                                ""
                            ))
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
                    <Button
                        variant="secondary"
                        onClick={handleClose}                    
                    >
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
