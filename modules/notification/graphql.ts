import { gql } from '@apollo/client';

export const sendContactForm = gql`
    mutation sendContactForm(
        $name: String!,
        $email: String!,
        $phone: String!,
        $message: String!,
    ) {
        sendContactForm(
            input: {
                type: "contact-form",
                name: $name
                email: $email
                phone: $phone, 
                message: $message, 
            }
        ) {
            email
        }
    }
`;
