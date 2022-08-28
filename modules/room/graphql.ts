import { gql } from '@apollo/client';

export const GetRoomsCarousel = gql`
    query GetRoomsCarousel {
        rooms {
            id
            slug
            title

            players_from
            players_to
            genre
            difficulty
            fear
            color

            location {
                id
                slug
                title
            }
        }
    }
`;

export const GetRoomsFilter = gql`
    query GetRoomsCarousel {
        rooms {
            id
            slug
            title

            duration
            break
            players_from
            players_to
            genre
            difficulty
            fear
            color

            location {
                id
                slug
                title
            }
            content

            tags {
                id
                slug
                title
            }
        }
    }
`;
