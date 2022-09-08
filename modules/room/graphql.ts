import { gql } from '@apollo/client';

export const GetRoom = gql`
    query GetRoom($column: RoomColumn, $slug: Mixed) {
        room(where: { column: $column, value: $slug }) {
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
            
            tags {
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

// export const GetRoomSchedule = gql`
//     query GetRoomSchedule($column: RoomColumn, $slug: Mixed) {
//         room(where: { column: $column, value: $slug }) {
//             id
//             slug
//
//             schedule {
//                 date_from
//                 date_to
//                 description
//                 week {
//                     time_slots {
//                         color
//                         price
//                         time_from
//                         time_to
//                     }
//                     week_days
//                 }
//             }
//         }
//     }
// `;
