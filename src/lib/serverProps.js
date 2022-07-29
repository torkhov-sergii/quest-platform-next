import { getApolloClient } from "@services/graphql/conf/apolloClient";
import { GetMenu } from "./graphql";

// For getting global server props and push them to layout and then to context
export default async function getServerSideProps(ctx) {
  const apolloClient = getApolloClient()

  // Get mainMenu from Settings Container
  // const { data: mainMenu } = await apolloClient.query({
  //   query: GetMenu,
  //   variables: {
  //     slug: 'header'
  //   },
  // })

  return {
    serverProps: {
      // mainMenu: mainMenu
    }
  };
}
