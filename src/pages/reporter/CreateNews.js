import React, { useState } from "react";
import { Col, Row, Button, Form, Container } from "react-bootstrap";
import axios from "axios";
import swal from "sweetalert";
import { CREATE_ARTICLE } from "./../../config/graphql/Mutations";
import { useMutation } from "@apollo/client";

const CreateNews = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [image, setImage] = useState(null);
    const idAuthor = localStorage.getItem("id");
    const token = localStorage.getItem("token");
    const [submitArticles] = useMutation(CREATE_ARTICLE);

    const handleChangeTitle = (e) => {
        setTitle(e.target.value);
    };

    const handleChangeContent = (e) => {
        setContent(e.target.value);
    };

    // let config = {
    //     method: "post",
    //     url: `https://xnews-development.herokuapp.com/x-news/?Query=mutation+_{submitArticles(title:"${title}",content:"${content}", author_id:${idAuthor}, status:"Submit"){id, title, content, author_id, status}}`,
    //     headers: {
    //         Authorization: `Bearer ${token}`,
    //     },
    // };

    // const createArticle = async (e) => {
    //     e.preventDefault();
    //     let idNews = null;
    //     const createArticleResponse = await axios(config)
    //         .then(function (response) {
    //             swal("News Created", `${title}`, "success");
    //             idNews = response.data.data.submitArticles.id;
    //             // console.log(response.data.data.submitArticles.id);
    //             window.location.assign("/mynews");
    //         })
    //         .catch(function (error) {
    //             console.log(error);
    //         });

    //     let FormData = require("form-data");
    //     let fs = require("fs");
    //     let data = new FormData();
    //     data.append("image", image, image.name);
    //     data.append("articles_id", idNews);

    //     axios({
    //         method: "post",
    //         url: "https://xnews-development.herokuapp.com/upload",
    //         headers: {
    //             Authorization: `Bearer ${token}`,
    //         },
    //         data,
    //     })
    //         .then((res) => {
    //             // console.log(res);
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //         });
    // };

    const createArticle = async (e) => {
        e.preventDefault();
        let idNews;
        await submitArticles({
            variables: {
                content: content,
                author_id: idAuthor,
                status: "Submit",
                title: title,
            },
        })
            .then((res) => {
                idNews = res.data.submitArticles.id;
                // console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });

        let FormData = require("form-data");
        // let fs = require("fs");
        let data = new FormData();
        data.append("image", image, image.name);
        data.append("articles_id", idNews);

        axios({
            method: "post",
            url: "https://xnews-graphql-playground.herokuapp.com/upload",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data,
        })
            .then(async (res) => {
                // console.log(idNews);
                // console.log(res);
                await swal("News Created", `${title}`, "success");
                window.location.assign("/mynews");
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const saveAsDraft = async (e) => {
        e.preventDefault();
        let idNews;
        await submitArticles({
            variables: {
                content: content,
                author_id: idAuthor,
                status: "Draft",
                title: title,
            },
        })
            .then((res) => {
                idNews = res.data.submitArticles.id;
                // console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });

        let FormData = require("form-data");
        // let fs = require("fs");
        let data = new FormData();
        data.append("image", image);
        data.append("articles_id", idNews);

        axios({
            method: "post",
            url: "https://xnews-graphql-playground.herokuapp.com/upload",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data,
        })
            .then(async (res) => {
                // console.log(idNews);
                // console.log(res);
                await swal("News saved as draft", `${title}`, "success");
                window.location.assign("/mydraft");
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <div>
            <Container className="container">
                <Row className="h1">
                    <Col>Create News</Col>
                </Row>
                <form onSubmit={createArticle}>
                    <Row>
                        <Col md={5}>
                            <Form.Group>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="News Title"
                                    onChange={handleChangeTitle}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.File
                                required
                                id="image"
                                name="image"
                                accept="image/*"
                                label="Cover/Thumbnail"
                                onChange={(e) => setImage(e.target.files[0])}
                                className="mb-2"
                                custom
                            />
                        </Col>
                        <Col md={2}>
                            <Button
                                variant="secondary"
                                style={{ width: "100%" }}
                                onClick={saveAsDraft}
                                className="mb-2"
                            >
                                Save as draft
                            </Button>
                        </Col>
                        <Col md={2}>
                            <Button
                                variant="primary"
                                type="submit"
                                style={{ width: "100%" }}
                                className="mb-2"
                            >
                                Submit
                            </Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Control
                                    required
                                    as="textarea"
                                    rows={5}
                                    placeholder="Write news"
                                    onChange={handleChangeContent}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                </form>
            </Container>
        </div>
    );
};

export default CreateNews;
