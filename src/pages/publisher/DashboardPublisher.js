import React from "react";
import { Row, Col, Container, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { GET_ARTICLES_AND_USERS } from "../../config/graphql/Queries";
import { useQuery } from "@apollo/client";
import { LoopCircleLoading } from "react-loadingg";
import  image  from "../../styles/img/image-null.png";
import {FaThumbsUp, FaThumbsDown} from 'react-icons/fa'

const DashboardPublisher = () => {
  const { loading, error, data } = useQuery(GET_ARTICLES_AND_USERS, {
    pollInterval: 500,
  });

  if (loading) return <LoopCircleLoading className="container" color="#000" />;

  const tanggalan = (date) => {
    let tanggal = new Date(date);
    let weton = String(tanggal).slice(0, 15);
    return weton;
  };

  const userTotal = (array) => {
    let jumlah = 0;
    for (let i = 0; i < array.length; i++) {
      if (array[i].roles === "user") {
        jumlah++;
      }
    }
    return jumlah;
  };

  const reporTotal = (array) => {
    let jumlah = 0;
    for (let i = 0; i < array.length; i++) {
      if (array[i].roles === "author") {
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

  return (
    <div id="dashboard-publisher">
      <Container className="container">
        <Row className=" mt-4">
          <Col className="mb-3" md={6} xs={12}>
            <Card className="card-shadow card-dashboard">
              <Row style={{ width: "100%" }}>
                <Col lg={9} md={9} xs={9} style={{ textAlign: "right" }}>
                  <Card.Title as="h6" className="engraved pt-2">
                    Total User{" "}
                  </Card.Title>
                </Col>
                <Col lg={3} md={3} xs={3} style={{ textAlign: "right" }}>
                  <Card.Text className="engraved">
                    {userTotal(data.GetAllUsers)}
                  </Card.Text>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col className="mb-3" xs={12} md={6}>
            <Card className="card-shadow card-dashboard">
              <Row style={{ width: "100%" }}>
                <Col lg={9} md={9} xs={9} style={{ textAlign: "right" }}>
                  <Card.Title as="h6" className="engraved pt-2">
                    Total Reporter{" "}
                  </Card.Title>
                </Col>
                <Col lg={3} md={3} xs={3} style={{ textAlign: "right" }}>
                  <Card.Text className="engraved">
                    {reporTotal(data.GetAllUsers)}
                  </Card.Text>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        <Row className="mb-5 d-flex justify-content-center">
          <Col md={6} xs={12}>
            <Card className="card-shadow card-dashboard ">
              <Row style={{ width: "100%" }}>
                <Col lg={9} md={9} xs={9}>
                  <Card.Title as="h6" className="engraved pt-2">
                    {" "}
                    Unapproved News{" "}
                  </Card.Title>
                </Col>
                <Col lg={3} md={3} xs={3}>
                  <Card.Text className="engraved">
                    {waiArticle(data.GetPublisherArticles)}
                  </Card.Text>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        <Row className="h1 mb-3">
          <Col>Trending</Col>
        </Row>
        <Row>
          {data.GetPublisherArticles.map(
            (items) =>
              items.status === "Approved" && (
                <Col
                  lg={4}
                  md={6}
                  sm={12}
                  xs={12}
                  key={items.id}
                  className="mb-3"
                >
                  <Card className="card-shadow">
                    <Card.Img
                      variant="top"
                      src={items.images !== "" ? items.images : image}
                      style={{maxHeight:'200px', objectFit:'cover'}}
                    />
                    <Card.Body>
                      <Row>
                        <Col>{tanggalan(items.created_at)}</Col>
                      </Row>
                      <Card.Title style={{ fontWeight: "bolder" }}>
                        {items.title}
                      </Card.Title>
                      <Row>
                        <Col>
                          <Card.Text>{items.author.fullname}</Card.Text>
                        </Col>
                      </Row>
                      <Row>
                        {items.categories.map((category) => (
                            <Card.Text
                            className="text-secondary ml-3 mr-0 mb-0"
                          >
                            {category.name}
                          </Card.Text>
                        ))}
                      </Row>
                      <Row className='mt-2 mb-0'>
                        <Col
                          xl={4}
                          lg={4}
                          xs={6}
                          className="d-flex justify-content-start mb-2"
                        >
                          <FaThumbsUp color="#5EA847" />
                          <Card.Text className="ml-3">
                            {items.likes}
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
                            {items.dislikes}
                          </Card.Text>
                        </Col>
                      </Row>
                      <Button
                        variant="primary"
                        as={Link}
                        to={{
                          pathname: `/trending/${items.id}`,
                          params: { items },
                        }}
                        className="mr-3  mb-0 mt-1"
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

export default DashboardPublisher;
