import { GET_LAUNCHES } from "@components/pages/main-page/graphql";
import { getApolloClient } from "@services/graphql/conf/apolloClient";

// For getting global server props and push them to layout and then to context
export default async function getServerSideProps(ctx) {
  const apolloClient = getApolloClient()

  const { data: mainMenu } = await apolloClient.query({
    query: GET_LAUNCHES,
    variables: {
      limit: 2,
    },
  })

  return {
    serverProps: {
      mainMenu: mainMenu
    }
  };
}
