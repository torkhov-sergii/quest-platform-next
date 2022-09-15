import { gql } from '@apollo/client';

export const GetLastArticles = gql`
  query GetLastArticles($first: Int!) {
    articles(orderBy: { column: ID, order: DESC }, first: $first) {
      data {
        id
        slug
        title
        content

        preview {
            url
        }
      }
    }
  }
`;

export const GetArticle = gql`
  query GetArticle($column: ArticleColumn, $slug: Mixed) {
    article(where: { column: $column, value: $slug }) {
      id
      slug
      title
      content

      preview {
          url
      }
    }
  }
`;
