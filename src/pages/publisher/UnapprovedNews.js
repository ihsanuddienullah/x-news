import React, { useState } from "react";
import { Container, Card, Row, Col, Form, Button } from "react-bootstrap";
import axios from "axios";
import swal from "sweetalert";
import {
  PUBLISH_ARTICLE,
  REJECT_ARTICLE,
} from "../../config/graphql/Mutations";
import {GET_DETAIL_ARTICLE} from "../../config/graphql/Queries"
import { useQuery, useMutation } from "@apollo/client";
import { LoopCircleLoading } from "react-loadingg";
import { useHistory } from "react-router-dom";

const NewsDetail = (props) => {
  const [publishNews] = useMutation(PUBLISH_ARTICLE);
  const [rejectNews] = useMutation(REJECT_ARTICLE);
  const idPublisher = localStorage.getItem("id");
  const idArticle = props.match.params.id;
  const [content, setContent] = useState("");
  const history = useHistory()
  
  const { error, loading, data } = useQuery(GET_DETAIL_ARTICLE, {
    variables: { id: idArticle },
  });

  if (loading) return <LoopCircleLoading className="container" color="#000" />;
  if (error) return <p className="container">Error :(</p>;

  const title = data.GetDetailArticles.title;
  const fill = data.GetDetailArticles.content;

  const handleChangeContent = (e) => {
    setContent(e.target.value);
  };

  // const token = localStorage.getItem("token");

  const publishArticle = async (e) => {
    e.preventDefault();
    await publishNews({
      variables: {
        id: idArticle,
        title: title,
        content: fill,
        status: "Approved",
      },
    });
    await swal("News published!", "", "success");
    history.push("/proposal");
    // var con = {
    //   method: 'post',
    //   url: `https://xnews-development.herokuapp.com/x-news/?Query=mutation+_{updateArticles(id:${idArticle},title:"${title}",content:"${fill}", status:"Approved"){id, title, content, status}}`,
    //   headers: {
    //     'Authorization': `Bearer ${token}`
    //   }
    // };

    // axios(con)
    // .then(function (response) {
    //   console.log(JSON.stringify(response.data));
    // })
    // .catch(function (error) {
    //   console.log(error);
    // });
  };

  const rejectArticle = async (e) => {
    e.preventDefault();
    await rejectNews({
      variables: {
        id: idArticle,
        title: title,
        content: fill,
        status: "Rejected",
        comment: content,
        notes_by: idPublisher,
        articles_id: idArticle,
      },
    });
    await swal("News rejected!", "", "success");
    history.push("/proposal");

    // var con = {
    //   method: 'post',
    //   url: `https://xnews-development.herokuapp.com/x-news/?Query=mutation+_{updateArticles(id:${idArticle},title:"${title}",content:"${fill}", status:"Rejected"){id, title, content, status}}`,
    //   headers: {
    //     'Authorization': `Bearer ${token}`
    //   }
    // };

    // axios(con)
    // .then(function (response) {
    //   console.log(JSON.stringify(response.data));
    //   window.location.assign('/proposal')
    // })
    // .catch(function (error) {
    //   console.log(error);
    // });

    // var config = {
    //   method: 'post',
    //   url: `https://xnews-development.herokuapp.com/x-news?Query=mutation+_{createNotes(notes:"Revisi",content:"${content}",notes_by:${idPublisher},articles_id:${idArticle}){id,notes, content,notes_by,articles_id}}`,
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //     "Context-Type": "application/json",
    //   },
    // };

    // axios(config)
    // .then(function (response) {
    //   swal( "Comment sent", '', 'success');
    //   // console.log(response);
    //   // console.log(JSON.stringify(response.data));
    //   window.location.assign('/proposal')
    // })
    // .catch(function (error) {
    //   console.log(error);
    // });
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
          <Col>
            Created at {tanggalan(data.GetDetailArticles.created_at)}
          </Col>
        </Row>
        <Row>
          <Col>
            <Card className="card-shadow p-5 rounded mb-3">
              <Card.Img
                src={data.GetDetailArticles.images}
                alt="news-pict"
              />
              <Card.Title style={{ fontSize: "40px" }}>{title}</Card.Title>
              <Card.Text className="text-justify">{fill}</Card.Text>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form>
              <Form.Text as="h2">Comment</Form.Text>
              <Form.Control
                as="textarea"
                rows={5}
                style={{ resize: "none", overflow: "auto" }}
                onChange={handleChangeContent}
              ></Form.Control>
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
