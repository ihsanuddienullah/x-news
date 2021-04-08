import React, { useState, useEffect } from "react";
import { Row, Col, Card, Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import { GET_AUTHOR_ARTICLES } from "./../../config/graphql/Queries";
import { useQuery } from "@apollo/client";
import { LoopCircleLoading } from "react-loadingg";
import image from "../../styles/img/image-null.png";

const DashboardReporter = () => {
    // const [news, setNews] = useState([]);
    const idAuthor = localStorage.getItem("id");
    const token = localStorage.getItem("token");

    // var data = JSON.stringify({
    //     query: `{getAuthorArticles(id:${idAuthor}){id, title, content, likes, dislikes, status, approved_by, deleted_by, created_at, categories{id, name}, author_id, , author{id, fullname, email, roles}notes{
    //         id
    //         content
    //     }}}`,
    //     variables: {},
    // });

    // var config = {
    //     method: "post",
    //     url: "https://xnews-development.herokuapp.com/x-news/",
    //     headers: {
    //         Authorization: `Bearer ${token}`,
    //         "Content-Type": "application/json",
    //     },
    //     data: data,
    // };

    // const getArticles = () => {
    //     axios(config)
    //         .then(function (response) {
    //             // console.log(response);
    //             setNews(response.data.data.getAuthorArticles);
    //         })
    //         .catch(function (error) {
    //             console.log(error);
    //         });
    // };

    // useEffect(() => {
    //     getArticles();
    // }, []);

    const { loading, error, data } = useQuery(GET_AUTHOR_ARTICLES, {
        variables: { id: idAuthor },
        pollInterval: 300,
    });

    if (loading)
        return <LoopCircleLoading className="container" color="#000" />;
    if (error) return <p className="container">Error :(</p>;

    // news.length === 0 && setNews(data.GetAuthorArticles);

    const appArticle = (array) => {
        let jumlah = 0;
        for (let i = 0; i < array.length; i++) {
            if (array[i].status === "Approved") {
                jumlah++;
            }
        }
        return jumlah;
    };

    const rejArticle = (array) => {
        let jumlah = 0;
        for (let i = 0; i < array.length; i++) {
            if (array[i].status === "Rejected") {
                jumlah++;
            }
        }
        return jumlah;
    };

    const waiArticle = (array) => {
        let jumlah = 0;
        for (let i = 0; i < array.length; i++) {
            if (array[i].status === "Submit") {
                jumlah++;
            }
        }
        return jumlah;
    };

    const tanggalan = (date) => {
        let tanggal = new Date(date);
        let weton = String(tanggal).slice(0, 15);
        return weton;
    };

    return (
        <div id="dashboard-reporter">
            <Container className="container">
                <Row className="mb-4 mt-4">
                    <Col>
                        <Card className="card-shadow card-dashboard">
                            <Row style={{ width: "100%" }}>
                                <Col
                                    lg={9}
                                    md={9}
                                    style={{ textAlign: "right" }}
                                >
                                    <Card.Title>News Total </Card.Title>
                                </Col>
                                <Col
                                    lg={3}
                                    md={3}
                                    style={{ textAlign: "right" }}
                                >
                                    <Card.Text>
                                        {data.GetAuthorArticles.length}
                                    </Card.Text>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                    <Col>
                        <Card className="card-shadow card-dashboard">
                            <Row style={{ width: "100%" }}>
                                <Col
                                    lg={9}
                                    md={9}
                                    style={{ textAlign: "right" }}
                                >
                                    <Card.Title>News Approved </Card.Title>
                                </Col>
                                <Col
                                    lg={3}
                                    md={3}
                                    style={{ textAlign: "right" }}
                                >
                                    <Card.Text>
                                        {appArticle(data.GetAuthorArticles)}
                                    </Card.Text>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
                <Row className="mb-5">
                    <Col>
                        <Card className="card-shadow card-dashboard">
                            <Row style={{ width: "100%" }}>
                                <Col
                                    lg={9}
                                    md={9}
                                    style={{ textAlign: "right" }}
                                >
                                    <Card.Title>Waiting Approval </Card.Title>
                                </Col>
                                <Col
                                    lg={3}
                                    md={3}
                                    style={{ textAlign: "right" }}
                                >
                                    <Card.Text>
                                        {waiArticle(data.GetAuthorArticles)}
                                    </Card.Text>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                    <Col>
                        <Card className="card-shadow card-dashboard">
                            <Row style={{ width: "100%" }}>
                                <Col
                                    lg={9}
                                    md={9}
                                    style={{ textAlign: "right" }}
                                >
                                    <Card.Title>News Rejected </Card.Title>
                                </Col>
                                <Col
                                    lg={3}
                                    md={3}
                                    style={{ textAlign: "right" }}
                                >
                                    <Card.Text>
                                        {rejArticle(data.GetAuthorArticles)}
                                    </Card.Text>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
                <Row className="h1 mb-3">
                    <Col>Published News</Col>
                </Row>
                <Row>
                    {data.GetAuthorArticles.map(
                        (newsData, index) =>
                            newsData.status === "Approved" && (
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
                                        />
                                        <Card.Body>
                                            <Card.Title
                                                style={{
                                                    fontWeight: "bolder",
                                                }}
                                            >
                                                {newsData.title}
                                            </Card.Title>
                                            <Row>
                                                <Col>
                                                    <Card.Text>
                                                        {
                                                            newsData.author
                                                                .fullname
                                                        }
                                                    </Card.Text>
                                                </Col>
                                                <Col>
                                                    {tanggalan(
                                                        newsData.created_at
                                                    )}
                                                </Col>
                                            </Row>
                                            <Button
                                                variant="primary"
                                                as={Link}
                                                to={{
                                                    pathname:
                                                        "/newsdetail/" +
                                                        newsData.id,
                                                    params: { newsData },
                                                }}
                                                className="mr-3  mb-0 mt-3"
                                                block
                                            >
                                                Detail
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            )
                    )}
                </Row>
            </Container>
        </div>
    );
};

export default DashboardReporter;
