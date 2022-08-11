import {gql} from "@apollo/client";

export const GetPage = gql`
    query GetPage($slug: Mixed) {
        page(where: {column: SLUG, value: $slug}) {
            id
            slug
            title
            content
        }
    }
`;
