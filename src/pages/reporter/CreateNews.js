import React, { useState } from "react";
import { Col, Row, Button, Form, Container } from "react-bootstrap";
import axios from "axios";
import swal from "sweetalert";
import { GET_ALL_CATEGORY } from "./../../config/graphql/Queries";
import { CREATE_ARTICLE } from "./../../config/graphql/Mutations";
import { useMutation, useQuery } from "@apollo/client";
import { LoopCircleLoading } from "react-loadingg";

const CreateNews = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [image, setImage] = useState(null);
    const [category] = useState([]);    
    const [submitArticles] = useMutation(CREATE_ARTICLE);
    
    const idAuthor = localStorage.getItem("id");
    const token = localStorage.getItem("token");

    const handleChangeTitle = (e) => {
        setTitle(e.target.value);
    };

    const handleChangeContent = (e) => {
        setContent(e.target.value);
    };

    const handleCategory = (e) => {
        const index = category.indexOf(`${e.target.name}`);
        e.target.checked
            ? category.push(e.target.name)
            : index > -1 && category.splice(index, 1);
    };    

    const createArticle = async (e) => {
        e.preventDefault();
        let idNews;
        if (category.length !== 0) {
            await submitArticles({
                variables: {
                    content: content,
                    author_id: idAuthor,
                    status: "Submit",
                    title: title,
                    categories: category.toString(),
                },
            })
                .then((res) => {
                    idNews = res.data.submitArticles.id;                    
                })
                .catch((err) => {
                    console.log(err);
                });

            let FormData = require("form-data");            
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
                    await swal("News created", `${title}`, "success");
                    window.location.assign("/mynews");
                })
                .catch((err) => {
                    console.log(err);
                    swal(
                        "Create news failed!",
                        "Please try again later or contact your administrator!",
                        "error"
                    );
                });
        } else {
            e.preventDefault();
            swal("Create news failed!", "Please choose category!", "error");
        }
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
                categories: category.toString(),
            },
        })
            .then((res) => {
                idNews = res.data.submitArticles.id;                
            })
            .catch((err) => {
                console.log(err);
            });

        let FormData = require("form-data");        
        let data = new FormData();
        data.append("image", image);
        data.append("articles_id", idNews);

        if (image !== null) {
            axios({
                method: "post",
                url: "https://xnews-graphql-playground.herokuapp.com/upload",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                data,
            })
                .then(async (res) => {                    
                    await swal("News saved as draft", `${title}`, "success");
                    window.location.assign("/mydraft");
                })
                .catch((err) => {
                    console.log(err);
                    swal(
                        "Save news failed!",
                        "Please try again later or contact your administrator!",
                        "error"
                    );
                });
        } else {
            await swal("News saved as draft", `${title}`, "success");
            window.location.assign("/mydraft");
        }
    };

    const { loading, error, data } = useQuery(GET_ALL_CATEGORY);

    if (loading)
        return <LoopCircleLoading className="container" color="#000" />;
    if (error) return <p className="container">Error :(</p>;    

    return (
        <div id="createNews">
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
                                className="mb-2"
                            >
                                Submit
                            </Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={3} sm={3} lg={2} xs={6}>
                            <p className="mb-0">Category : </p>
                        </Col>
                    </Row>
                    <Row>
                        {data.GetAllCategories.map((category, index) => (
                            <Col md={3} sm={3} lg={2} xs={6} key={index}>
                                <Form.Check
                                    type="checkbox"
                                    label={category.name}
                                    name={category.id}
                                    onChange={handleCategory}
                                />
                            </Col>
                        ))}
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
