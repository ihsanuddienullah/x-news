import React from "react";
import { Container, Card, Row, Col } from "react-bootstrap";
import { GET_DETAIL_ARTICLE } from "./../../config/graphql/Queries";
import { useQuery } from "@apollo/client";
import { LoopCircleLoading } from "react-loadingg";
import image from "../../styles/img/image-null.png";

const NewsDetail = (props) => {
    const idArticle = props.match.params.id;
    const { error, loading, data } = useQuery(GET_DETAIL_ARTICLE, {
        variables: { id: idArticle },
    });

    if (loading)
        return <LoopCircleLoading className="container" color="#000" />;
    if (error) return <p className="container">Error :(</p>;

    const comments = data.GetDetailArticles.notes;

    const tanggalan = (date) => {
        let tanggal = new Date(date);
        let weton = String(tanggal).slice(0, 15);
        return weton;
    };

    return (
        <div>
            <Container className="container mb-3">
                <Row className="mb-3">
                    <Col>
                        Created at{" "}
                        {tanggalan(data.GetDetailArticles.created_at)}
                    </Col>
                </Row>
                <Row>
                    <Col md={comments.length === 0 ? 12 : 8}>
                        <Card className="card-shadow p-5 rounded mb-3">
                            <img
                                src={
                                    data.GetDetailArticles.images !== ""
                                        ? data.GetDetailArticles.images
                                        : image
                                }
                                alt="news-pict"
                            />
                            <Row className='mt-2'>
                            {data.GetDetailArticles.categories.map((category) => (
                                    <Card.Text
                                        className="text-secondary ml-3 mr-0 mb-0"
                                    >
                                        {category.name}
                                    </Card.Text>
                            ))}
                            </Row>
                            <Card.Title style={{ fontSize: "40px" }}>
                                {data.GetDetailArticles.title}
                            </Card.Title>
                            <Card.Text className="text-justify">
                                {data.GetDetailArticles.content}
                            </Card.Text>
                        </Card>
                    </Col>
                    <Col md={4}>
                        {comments.map((items, index) => (
                            <Card
                                key={index}
                                className="card-shadow p-4 rounded mb-3"
                            >
                                <Card.Title style={{ fontSize: "30px" }}>
                                    {items.notes}
                                </Card.Title>
                                {/* {props.location.params.newsData.notes.map((note) => (
              ))} */}
                                <Card.Text className="text-justify">
                                    {/* <p>Notes</p> */}
                                    {items.content}
                                </Card.Text>
                            </Card>
                        ))}
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default NewsDetail;
