import { gql } from '@apollo/client';

export const createTimeslot = gql`
    mutation createTimeslot(
        $room_id: Int!, 
        $start: String!, 
        $status: String!,
        $players: Int!,
        $price_final: Int!,
        $price: Int!,
        $players_from: Int!,
        $players_to: Int!,
        
        $order: OrderInput,
        $customer: CustomerInput,
    ) {
        createTimeslot(
            input: {
                room_id: $room_id,
                start: $start
                status: $status
                players: $players, 
                price_final: $price_final, 
                price: $price, 
                players_from: $players_from,
                players_to: $players_to
                order: $order
                customer: $customer
            }
        ) {
            id
            order {
                id
                secret_key
            }
        }
    }
`;

export const updateTimeslot = gql`
    mutation updateTimeslot(
        $id: ID!, 
        $room_id: Int!, 
        $start: String!, 
        $status: String!,
        $players: Int!,
        $price_final: Int!,

        $order: OrderInput,
        $customer: CustomerInput,
    ) {
        updateTimeslot(
            id: $id,
            input: {
                room_id: $room_id,
                start: $start
                status: $status
                players: $players, 
                price_final: $price_final, 
                order: $order
                customer: $customer
            }
        ) {
            id
        }
    }
`;

export const cancelTimeslot = gql`
    mutation cancelTimeslot(
        $id: ID!, 
    ) {
        cancelTimeslot(
            id: $id,
        ) {
            id
        }
    }
`;

export const GetTimeslots = gql`
    query GetTimeslots($from: Mixed!, $to: Mixed!, $room_id: Mixed!) {
        timeslots(where: {
            column: START, operator: GTE, value: $from, 
            AND: {
                column: START, operator: LTE, value: $to, 
                AND: {
                    column: ROOM_ID, value: $room_id, 
                    AND: {
                        column: STATUS, operator: NEQ, value: "canceled"
                    }
                }
            }
        }) {
            id
            start
            status
            players
        }
    }
`;

export const GetTimeslot = gql`
    query GetTimeslot($id: ID!) {
        timeslot(id: $id) {
            id
            room_id
            
            start
            status

            players
            price
            
            room {
                id
                title
                
                players_from
                players_to

                location {
                    title
                }
            }
            
            order {
                comment
                customer_comment

                customer {
                    name
                    email
                    phone
                }
            }
        }
    }
`;

export const GetFinalPrice = gql`
    query GetFinalPrice(
        $id: ID
        $room_id: Int!,
        $start: String!,
        $players: Int!,
        $price: Int!,
    ) {
        finalPrice(id: $id,
            input: {
                room_id: $room_id,
                start: $start
                players: $players,
                price: $price,
            }
        )
    }
`;
