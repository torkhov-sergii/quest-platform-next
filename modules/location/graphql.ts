import { gql } from '@apollo/client';

export const GetLocations = gql`
  query GetLocations {
    locations {
      id
      slug
      title

      content {
          address
          city
          email
          lat
          lon
          phone
      }
    }
  }
`;
