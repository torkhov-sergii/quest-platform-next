import { gql } from '@apollo/client';

export const GetRoomsCarousel = gql`
    query GetRoomsCarousel {
        rooms {
            id
            slug
            title
            duration
            players_from
            players_to
            difficulty
            location {
                id
                slug
                title
            }
        }
    }
`;
