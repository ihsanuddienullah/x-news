import { gql } from "@apollo/client";

export const GET_ARTICLES_AND_USERS = gql`
    query Query {
        GetPublisherArticles {
            id
            title
            created_at
            content
            author {
                fullname
            }
            categories {
                name
            }
            status
            images
        }
        GetAllUsers {
            id
            email
            fullname
            roles
        }
    }
`;

export const GET_AUTHOR_ARTICLES = gql`
    query($id: Int!) {
        GetAuthorArticles(id: $id) {
            id
            title
            content
            likes
            dislikes
            status
            approved_by
            deleted_by
            created_at
            images
            categories {
                id
                name
            }
            author_id
            author {
                id
                fullname
                email
                roles
            }
            notes {
                id
                notes
                content
            }
        }
    }
`;

export const GET_DETAIL_ARTICLE = gql`
    query($id: Int!) {
        GetDetailArticles(id: $id) {
            id
            title
            content
            likes
            dislikes
            status
            approved_by
            deleted_by
            created_at
            images
            categories {
                id
                name
            }
            author_id
            author {
                id
                fullname
                email
                roles
            }
            notes {
                id
                notes
                content
            }
        }
    }
`;

export const GET_AUTHOR_DRAFT = gql`
    query($id: Int!) {
        GetAuthorDrafts(id: $id) {
            id
            title
            content
            likes
            dislikes
            status
            approved_by
            deleted_by
            created_at
            images
            categories {
                id
                name
            }
            author_id
            author {
                id
                fullname
                email
                roles
            }
            notes {
                id
                notes
                content
            }
        }
    }
`;

export const GET_ALL_CATEGORY = gql`
    query {
        GetAllCategories {
            id
            name
        }
    }
`;
