import React, { useState, useEffect } from "react";
import { Col, Row, Button, Form, Container } from "react-bootstrap";
import axios from "axios";
import swal from "sweetalert";
import { UPDATE_ARTICLE } from "../../config/graphql/Mutations";
import { GET_ALL_CATEGORY } from "./../../config/graphql/Queries";
import { useMutation, useQuery } from "@apollo/client";
import { LoopCircleLoading } from "react-loadingg";

const EditNews = (props) => {
    const [title, setTitle] = useState(props.location.state.detail.title);
    const [content, setContent] = useState(props.location.state.detail.content);
    const [image, setImage] = useState(props.location.state.detail.images);
    const [categoryArticle] = useState(props.location.state.detail.categories);
    const [category] = useState([]);
    const [deletedCategory] = useState([]);
    const [updateArticles] = useMutation(UPDATE_ARTICLE);
    const { loading, error, data } = useQuery(GET_ALL_CATEGORY);
    const gambar = props.location.state.detail.images;
    const idArticle = props.location.state.detail.id;
    const token = localStorage.getItem("token");

    useEffect(() => {
        categoryArticle.map((ctgry) => {
            return deletedCategory.push(ctgry.id);
        });
    }, []);
    console.log(deletedCategory.toString());

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
        console.log(category.toString());
    };

    const updateArticle = async (e) => {
        e.preventDefault();
        if (category.length !== 0) {
            await updateArticles({
                variables: {
                    id: idArticle,
                    title: title,
                    content: content,
                    status: "Submit",                    
                    added_categories: category.toString(),
                },
            });

            let FormData = require("form-data");
            let dataForm = new FormData();
            dataForm.append("image", image);
            dataForm.append("articles_id", idArticle);

            if (image !== gambar) {
                axios({
                    method: "post",
                    url:
                        "https://xnews-graphql-playground.herokuapp.com/upload",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    dataForm,
                })
                    .then(async (res) => {
                        await swal("News Edited", `${title}`, "success");
                        window.location.assign("/mynews");
                    })
                    .catch((err) => {
                        console.log(err);
                        swal(
                            "Edit news failed!",
                            "Please try again later or contact your administrator!",
                            "error"
                        );
                    });
            } else {
                await swal("News Edited", `${title}`, "success");
                window.location.assign("/mynews");
            }
        } else {
            e.preventDefault();
            swal(
                "Update news failed!",
                "Please choose the new category!",
                "error"
            );
        }
    };

    const updateDraftArticle = async (e) => {
        e.preventDefault();
        await updateArticles({
            variables: {
                id: idArticle,
                title: title,
                content: content,
                status: "Draft",
                added_categories: category.toString(),
            },
        });

        let FormData = require("form-data");
        let dataForm = new FormData();
        dataForm.append("image", image);
        dataForm.append("articles_id", idArticle);

        if (image !== gambar) {
            axios({
                method: "post",
                url: "https://xnews-graphql-playground.herokuapp.com/upload",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                dataForm,
            })
                .then(async (res) => {
                    await swal("Draft Edited", `${title}`, "success");
                    window.location.assign("/mydraft");
                })
                .catch((err) => {
                    console.log(err);
                    swal(
                        "Edit news failed!",
                        "Please try again later or contact your administrator!",
                        "error"
                    );
                });
        } else {
            await swal("Draft Edited", `${title}`, "success");
            window.location.assign("/mydraft");
        }
    };

    if (loading)
        return <LoopCircleLoading className="container" color="#000" />;
    if (error) return <p className="container">Error :(</p>;

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
                            <span className="mb-0">Current category : </span>
                            {categoryArticle.map((ctgry, index) => (
                                <span
                                    className="mr-3 font-weight-bold"
                                    key={index}
                                >
                                    {ctgry.name}
                                </span>
                            ))}
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12} sm={12} lg={12} xs={12}>
                            <p className="mb-0">New category (Please choose again the category!) : </p>
                        </Col>
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
