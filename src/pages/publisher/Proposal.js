import React, { useState } from "react";
import { Row, Col, Container, Card, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { GET_ARTICLES_AND_USERS } from "../../config/graphql/Queries";
import { useQuery } from "@apollo/client";
import { LoopCircleLoading } from "react-loadingg";
import  image  from "../../styles/img/image-null.png";

export default function Proposal() {
  const [values, setValues] = useState("");
  const { loading, error, data } = useQuery(GET_ARTICLES_AND_USERS, {pollInterval: 500});

  if (loading) return <LoopCircleLoading className="container" color="#000" />;
  if (error) return <LoopCircleLoading className="container" color="#000" />;

  const handleChange = (event) => {
    event.persist();
    setValues(event.target.value);
  };

  const tanggalan = (date) => {
    let tanggal = new Date(date);
    let weton = String(tanggal).slice(0, 15);
    return weton;
  };

  return (
    <div id="proposal">
      <Container className="container">
        <Row className="d-flex justify-content-end mb-3">
          <Col md={12} lg={4} sm={12} xs={12}>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Search news"
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          {data.GetPublisherArticles.map(
            (items) =>
              items.status === "Submit" &&
              items.title.toLowerCase().includes(values.toLowerCase()) && (
                <Col
                  lg={4}
                  md={6}
                  sm={12}
                  xs={12}
                  key={items.id}
                  className="mb-3"
                >
                  <Card className="card-shadow">
                    <Card.Img variant="top" src={items.images !== "" ? items.images : image} style={{maxHeight:'200px', objectFit:'cover'}} />
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
                      <Row>
                        <Button
                          variant="primary"
                          as={Link}
                          to={{
                            pathname: "/unapprovednews/" + items.id,
                            params: { items },
                          }}
                          className="mr-3 ml-3 mb-0 mt-3"
                          block
                        >
                          Detail
                        </Button>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              )
          )}
        </Row>
      </Container>
    </div>
  );
}
