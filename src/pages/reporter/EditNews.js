import React, { useState } from "react";
import { Col, Row, Button, Form, Container } from "react-bootstrap";
import axios from "axios";
import swal from "sweetalert";
import { UPDATE_ARTICLE } from "../../config/graphql/Mutations";
import { useMutation } from "@apollo/client";

const EditNews = (props) => {
    const [title, setTitle] = useState(props.location.state.detail.title);
    const [content, setContent] = useState(props.location.state.detail.content);
    const [image, setImage] = useState(props.location.state.detail.images);
    const [updateArticles] = useMutation(UPDATE_ARTICLE);
    // const status = props.location.state.detail.status;
    const idArticle = props.location.state.detail.id;
    const token = localStorage.getItem("token");

    const handleChangeTitle = (e) => {
        setTitle(e.target.value);
    };

    const handleChangeContent = (e) => {
        setContent(e.target.value);
    };

    // let config = {
    //     method: "post",
    //     url: `https://xnews-development.herokuapp.com/x-news/?Query=mutation+_{updateArticles(id:${idArticle},title:"${title}",content:"${content}" status:"${status}"){id, title, content, status}}`,
    //     headers: {
    //         Authorization: `Bearer ${token}`,
    //     },
    // };

    // const updateArticle = (e) => {
    //     e.preventDefault();
    //     axios(config)
    //         .then(function (response) {
    //             swal("News Edited", `${title}`, "success");
    //             // console.log(response);
    //             window.location.assign("/mynews");
    //         })
    //         .catch(function (error) {
    //             console.log(error);
    //         });
    // };

    const updateArticle = async (e) => {
        e.preventDefault();
        await updateArticles({
            variables: {
                id: idArticle,
                title: title,
                content: content,
                status: "Submit",
            },
        });

        let FormData = require("form-data");
        // let fs = require("fs");
        let data = new FormData();
        data.append("image", image);
        data.append("articles_id", idArticle);

        axios({
            method: "post",
            url: "https://xnews-graphql-playground.herokuapp.com/upload",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data,
        })
            .then((res) => {
                // console.log(idNews);
                // console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });
        await swal("News Edited", `${title}`, "success");
        window.location.assign("/mynews");
    };

    const updateDraftArticle = async (e) => {
        e.preventDefault();
        await updateArticles({
            variables: {
                id: idArticle,
                title: title,
                content: content,
                status: "Draft",
            },
        });

        let FormData = require("form-data");
        // let fs = require("fs");
        let data = new FormData();
        data.append("image", image);
        data.append("articles_id", idArticle);

        axios({
            method: "post",
            url: "https://xnews-graphql-playground.herokuapp.com/upload",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data,
        })
            .then((res) => {
                // console.log(idNews);
                // console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });
        await swal("Draft Edited", `${title}`, "success");
        window.location.assign("/mydraft");
    };

    return (
        <div id="editNews">
            <Container className="container">
                <Row className="h1">
                    <Col>Edit News</Col>
                </Row>
                <form onSubmit={updateArticle}>
                    <Row>
                        <Col md={5}>
                            <Form.Group>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="News Title"
                                    onChange={handleChangeTitle}
                                    value={title}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.File
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
                                onClick={updateDraftArticle}
                                className="mb-2"
                            >
                                Save as draft
                            </Button>
                        </Col>
                        <Col md={2}>
                            <Button
                                variant="primary"
                                type="submit"
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
                                    value={content}
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

export default EditNews;
