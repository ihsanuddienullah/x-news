import React from "react";
import { Container, Card, Row, Col } from "react-bootstrap";
import { GET_DETAIL_ARTICLE } from "./../../config/graphql/Queries";
import { useQuery } from "@apollo/client";
import { LoopCircleLoading } from "react-loadingg";

const NewsDetail = (props) => {
  const idArticle = props.match.params.id;
  const { error, loading, data } = useQuery(GET_DETAIL_ARTICLE, {
    variables: { id: idArticle },
  });

  if (loading) return <LoopCircleLoading className="container" color="#000" />;
  if (error) return <p className="container">Error :(</p>;

  const tanggalan = (date) => {
    let tanggal = new Date(date);
    let weton = String(tanggal).slice(0, 15);
    return weton;
  };
  return (
    <div id="trending">
      <Container className="container mb-3">
        <Row className="mb-3">
          <Col>Created at {tanggalan(data.GetDetailArticles.created_at)}</Col>
        </Row>
        <Row>
          <Col>
            <Card className="card-shadow p-5 mb-3">
              <Card.Img src={data.GetDetailArticles.images} alt="news-pict" />
              <Row className="mt-3">
                {data.GetDetailArticles.categories.map((category) => (
                  <Card.Text className="text-secondary ml-3 mr-0 mb-0">
                    {category.name}
                  </Card.Text>
                ))}
              </Row>
              <Card.Title style={{ fontSize: "40px" }}>
                {data.GetDetailArticles.title}
              </Card.Title>
              <Card.Text
                style={{ fontWeight: "bold" }}
              >{`By ${data.GetDetailArticles.author.fullname}`}</Card.Text>
              <Card.Text className="text-justify">
                {data.GetDetailArticles.content}
              </Card.Text>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default NewsDetail;
