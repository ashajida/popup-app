import { GraphQLClient } from "node_modules/@shopify/shopify-app-remix/dist/ts/server/clients/types";

export const getProductByID = async (
  id: string,
  gQClient: GraphQLClient<AdminOperations>,
) => {
  const gid = `gid://shopify/Product/${id}`;

  const response = await gQClient(
    `#graphql
  query
    GetProduct($id: ID!) {
    product(id: $id) {
      id
      title
      descriptionHtml
      variants(first: 10) {
        edges {
          node {
            id
            title
            price
            image: image {
              src
    }
          }
        }
      }
    }
  }
    `,
    { variables: { id: gid } },
  );

  const result = await response.json();

  if (!result.data) {
    return {
      success: false,
      errorMessage: "Product not found",
    };
  }

  return {
    data: {
      id: result.data.product.id,
      title: result.data.product.title,
      descriptionHtml: result.data.product.descriptionHtml,
      images: result.data.product.images,
      variants: result.data.product.variants.edges.map((edge) => edge.node),
    },
    success: true,
  };
};

export const getProducts = async (
  ids: string[],
  gQClient: GraphQLClient<AdminOperations>,
) => {
  const response = await gQClient(
    `#graphql
  query GetProducts($ids: [ID!]!) {
      nodes(ids: $ids) {
        ... on Product {
          id
          title
          descriptionHtml
          images(first: 1) {
            edges {
              node {
                src
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                price
              }
            }
          }
        }
      }
    }
    `,
    { variables: { ids } },
  );

  const result = await response.json();

  console.log("products....", result.data.nodes);

  if (!result.data) {
    return {
      success: false,
      errorMessage: "Product not found",
    };
  }

  return {
    data: result.data.nodes.map((product) => {
      return {
        id: product.id,
        title: product.title,
        descriptionHtml: product.descriptionHtml,
        images: product.images.edges.map((edge) => edge.node),
        variants: product.variants.edges.map((edge) => edge.node),
      };
    }),
    success: true,
  };
};