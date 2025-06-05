import { authenticate } from "app/shopify.server";

export const graphqlClient = async (request: Request) => {
   const { admin } = await authenticate.admin(request);
    const client = admin.graphql;
    return client;
}
