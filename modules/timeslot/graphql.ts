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
        }
    }
`;

export const GetTimeslots = gql`
    query GetTimeslots($from: Mixed!, $to: Mixed!) {
        timeslots(where: {
            column: START, operator: GTE, value: $from, AND: {column: START, operator: LTE, value: $to}
        }) {
            id
            start
            status
        }
    }
`;

