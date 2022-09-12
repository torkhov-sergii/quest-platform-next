import { gql } from '@apollo/client';

export const GetAdminRoomsFilter = gql`
    query GetRoomsFilter {
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

            content

            location {
                id
                slug
                title
            }

            schedule {
                date_from
                date_to
                description
                week {
                    time_slots {
                        color
                        price
                        time_from
                        time_to
                    }
                    week_days
                }
            }
        }
    }
`;
