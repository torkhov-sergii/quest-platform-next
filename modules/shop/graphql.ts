import { gql } from '@apollo/client';

export const GetOrder = gql`
    query GetOrder($column: OrderColumn, $value: Mixed) {
        order(where: { column: $column, value: $value }) {
            id
            number
            
            total_price
            status

            customer {
                id
                name
                phone
            }

            timeslots {
                id
                order_id
                number
                
                start
                status

                players
                price_final

                room {
                    title

                    location {
                        id
                        title
                        content {
                            city
                            address
                            phone
                        }
                    }
                }
            }
        }
    }
`;
