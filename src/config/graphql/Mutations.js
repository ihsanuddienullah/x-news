import { gql } from "@apollo/client";

export const CREATE_AUTHOR = gql`
    mutation CreateAuthor(
        $password: String!
        $fullname: String!
        $email: String!
    ) {
        createAuthor(password: $password, fullname: $fullname, email: $email) {
            id
            email
            fullname
            roles
        }
    }
`;

export const UPDATE_USER = gql`
    mutation UpdateUser($id: Int!, $fullname: String!) {
        updateUsers(id: $id, fullname: $fullname) {
            id
            email
            fullname
            roles
        }
    }
`;

export const DELETE_AUTHOR = gql`
    mutation DeleteAuthor($id: Int!) {
        deleteAuthor(id: $id) {
            id
            email
            fullname
            roles
        }
    }
`;

export const PUBLISH_ARTICLE = gql`
    mutation PublishArticle(
        $title: String
        $content: String
        $status: String
        $id: Int!
    ) {
        updateArticles(
            title: $title
            content: $content
            status: $status
            id: $id
        ) {
            id
            status
            title
            content
        }
    }
`;

export const CREATE_ARTICLE = gql`
    mutation(
        $content: String
        $author_id: Int
        $status: String
        $title: String
        $categories: String
    ) {
        submitArticles(
            content: $content
            author_id: $author_id
            status: $status
            title: $title
            categories: $categories
        ) {
            id
            title
            content
            author_id
            status
            categories {
                id
                name
            }
        }
    }
`;

export const UPDATE_ARTICLE = gql`
  mutation($content: String, $status: String, $id: Int!, $title: String, $added_categories: String) {
    updateArticles(content: $content, status: $status, id: $id, title: $title, added_categories: $added_categories) {
      id
      title
      content
      status
      categories {
        id
        name
      }
    }
  }
`;

export const DELETE_ARTICLE = gql`
    mutation($id: Int!) {
        deleteArticles(id: $id) {
            id
            title
        }
    }
`;

export const REJECT_ARTICLE = gql`
    mutation RejectArticle(
        $title: String
        $content: String
        $status: String
        $id: Int!
        $notes: String
        $comment: String
        $notes_by: Int
        $articles_id: Int
    ) {
        updateArticles(
            title: $title
            content: $content
            status: $status
            id: $id
        ) {
            id
            status
            title
            content
        }
        createNotes(
            notes: $notes
            content: $comment
            notes_by: $notes_by
            articles_id: $articles_id
        ) {
            id
            notes
            content
            notes_by
            articles_id
        }
    }
`;
