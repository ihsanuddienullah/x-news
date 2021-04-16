import React from "react";
import { Row, Col, Card, Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { GET_AUTHOR_ARTICLES } from "./../../config/graphql/Queries";
import { useQuery } from "@apollo/client";
import { LoopCircleLoading } from "react-loadingg";
import image from "../../styles/img/image-null.png";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";

const DashboardReporter = () => {
  const idAuthor = localStorage.getItem("id");
  const { loading, error, data } = useQuery(GET_AUTHOR_ARTICLES, {
    variables: { id: idAuthor },
    pollInterval: 300,
  });

  if (loading) return <LoopCircleLoading className="container" color="#000" />;
  if (error) return <p className="container">Error :(</p>;  

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
          <Col className="mb-3" md={6} xs={12}>
            <Card className="card-shadow card-dashboard">
              <Row style={{ width: "100%" }}>
                <Col lg={9} md={9} xs={9} style={{ textAlign: "right" }}>
                  <Card.Title className="engraved">News Total </Card.Title>
                </Col>
                <Col lg={3} md={3} xs={3} style={{ textAlign: "right" }}>
                  <Card.Text className="engraved">
                    {data.GetAuthorArticles.length}
                  </Card.Text>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col md={6} xs={12}>
            <Card className="card-shadow card-dashboard">
              <Row style={{ width: "100%" }}>
                <Col lg={9} md={9} xs={9} style={{ textAlign: "right" }}>
                  <Card.Title className="engraved">News Approved </Card.Title>
                </Col>
                <Col lg={3} md={3} xs={3} style={{ textAlign: "right" }}>
                  <Card.Text className="engraved">
                    {appArticle(data.GetAuthorArticles)}
                  </Card.Text>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        <Row className="mb-5">
          <Col className="mb-3" md={6} xs={12}>
            <Card className="card-shadow card-dashboard">
              <Row style={{ width: "100%" }}>
                <Col lg={9} md={9} xs={9} style={{ textAlign: "right" }}>
                  <Card.Title className="engraved">
                    Waiting Approval{" "}
                  </Card.Title>
                </Col>
                <Col lg={3} md={3} xs={3} style={{ textAlign: "right" }}>
                  <Card.Text className="engraved">
                    {waiArticle(data.GetAuthorArticles)}
                  </Card.Text>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col md={6} xs={12}>
            <Card className="card-shadow card-dashboard">
              <Row style={{ width: "100%" }}>
                <Col lg={9} md={9} xs={9} style={{ textAlign: "right" }}>
                  <Card.Title className="engraved">News Rejected </Card.Title>
                </Col>
                <Col lg={3} md={3} xs={3} style={{ textAlign: "right" }}>
                  <Card.Text className="engraved">
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
                <Col md={6} sm={12} lg={4} xs={12} key={index} className="mb-3">
                  <Card className="card-shadow">
                    <Card.Img
                      variant="top"
                      src={newsData.images !== "" ? newsData.images : image}
                      style={{
                        maxHeight: "200px",
                        objectFit: "cover",
                      }}
                    />
                    <Card.Body>
                      <Row>
                        <Col>{tanggalan(newsData.created_at)}</Col>
                      </Row>
                      <Card.Title
                        style={{
                          fontWeight: "bolder",
                        }}
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
                          xl={4}
                          lg={4}
                          xs={6}
                          className="d-flex justify-content-start mb-2"
                        >
                          <FaThumbsUp color="#5EA847" />
                          <Card.Text className="ml-3">
                            {newsData.likes}
                          </Card.Text>
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
                      <Button
                        variant="primary"
                        as={Link}
                        to={{
                          pathname: "/newsdetail/" + newsData.id,
                          params: { newsData },
                        }}
                        className="mr-3  mb-0 mt-2"
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
