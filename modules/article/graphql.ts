import { gql } from '@apollo/client';

export const GetLastArticles = gql`
    query GetLastArticles($first: Int!) {
        articles(orderBy: {column: ID, order: DESC}, first: $first) {
            data {
                id
                slug
                title
                content
            }
        }
    }
`;
