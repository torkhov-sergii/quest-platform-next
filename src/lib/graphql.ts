import { gql } from "@apollo/client";

export const GetMenu = gql`
    query GetMenu($slug: Mixed!) {
        menu(where: {column: SLUG, value: $slug}) {
            id
            name
            slug
            locale
            menuItems {
                id
                name
                enabled
                target
                type
                value
                data {
                    value
                }
            }
        }
    }
`;
