import React, { useState } from "react";
import { Container, Card, Row, Col, Form, Button } from "react-bootstrap";
import swal from "sweetalert";
import {
  PUBLISH_ARTICLE,
  REJECT_ARTICLE,
} from "../../config/graphql/Mutations";
import { GET_DETAIL_ARTICLE } from "../../config/graphql/Queries";
import { useQuery, useMutation } from "@apollo/client";
import { LoopCircleLoading } from "react-loadingg";
import { useHistory } from "react-router-dom";
import image from '../../styles/img/image-null.png'

const NewsDetail = (props) => {
  const [publishNews] = useMutation(PUBLISH_ARTICLE);
  const [rejectNews] = useMutation(REJECT_ARTICLE);
  const idPublisher = localStorage.getItem("id");
  const idArticle = props.match.params.id;
  const [content, setContent] = useState("");
  const [contentTitle, setContentTitle] = useState("");
  const history = useHistory();

  const { error, loading, data } = useQuery(GET_DETAIL_ARTICLE, {
    variables: { id: idArticle },
  });

  if (loading) return <LoopCircleLoading className="container" color="#000" />;
  if (error) return <p className="container">Error :(</p>;

  const title = data.GetDetailArticles.title;
  const fill = data.GetDetailArticles.content;

  const handleChangeContentTitle = (e) => {
    setContentTitle(e.target.value);
  };

  const handleChangeContent = (e) => {
    setContent(e.target.value);
  };

  const publishArticle = async (e) => {
    e.preventDefault();
    await publishNews({
      variables: {
        id: idArticle,
        title: title,
        content: fill,
        status: "Approved",
      },
    })
      .then(async (res) => {
        await swal("News published!", "", "success");
        history.push("/proposal");
      })
      .catch((e) => {
        console.log(e);
        swal(
          "Operation failed!",
          "Please try again later or contact your administrator!",
          "error"
        );
      });
  };

  const rejectArticle = async (e) => {
    e.preventDefault();
    await rejectNews({
      variables: {
        id: idArticle,
        title: title,
        content: fill,
        status: "Rejected",
        notes: !contentTitle ? "Notes" : contentTitle,
        comment: content,
        notes_by: idPublisher,
        articles_id: idArticle,
      },
    })
      .then(async (res) => {
        await swal("News rejected!", "", "success");
        history.push("/proposal");
      })
      .catch((e) => {
        swal(
          "Operation failed!",
          "Please try again later or contact your administrator!",
          "error"
        );
      });
  };

  const tanggalan = (date) => {
    let tanggal = new Date(date);
    let weton = String(tanggal).slice(0, 15);
    return weton;
  };
  return (
    <div id="unapproved-news">
      <Container className="container mb-3">
        <Row className="mb-3">
          <Col>Created at {tanggalan(data.GetDetailArticles.created_at)}</Col>
        </Row>
        <Row>
          <Col>
            <Card className="card-shadow p-5 rounded mb-3">
              <Card.Img src={data.GetDetailArticles.images !== ""
                                        ? data.GetDetailArticles.images
                                        : image} alt="news-pict" />
              <Row className='mt-3'>
                {data.GetDetailArticles.categories.map((category) => (
                  <Card.Text className="text-secondary ml-3 mr-0 mb-0">
                    {category.name}
                  </Card.Text>
                ))}
              </Row>
              <Card.Title style={{ fontSize: "40px", fontWeight: "bolder" }}>
                {title}
              </Card.Title>
              <Card.Text
                style={{ fontWeight: "bold" }}
              >{`By ${data.GetDetailArticles.author.fullname}`}</Card.Text>
              <Card.Text className="text-justify">{fill}</Card.Text>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form>
              <Form.Text as="h2">Comment</Form.Text>
              <Form.Control
                type="text"
                onChange={handleChangeContentTitle}
                placeholder="What is your comment about? (optional)"
                className="mb-2"
              />
              <Form.Control
                as="textarea"
                rows={5}
                style={{ resize: "none", overflow: "auto" }}
                onChange={handleChangeContent}
                placeholder="Describe your comment here"
                required
              />
              <Row className="d-flex justify-content-start flex-row-reverse mt-3 ">
                <Col lg={2} xs={12}>
                  <Button
                    type="submit"
                    onClick={publishArticle}
                    block
                    className="mb-3"
                  >
                    Publish
                  </Button>
                </Col>
                <Col lg={2} xs={12}>
                  <Button
                    variant="danger"
                    type="submit"
                    onClick={rejectArticle}
                    block
                  >
                    Reject
                  </Button>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default NewsDetail;
