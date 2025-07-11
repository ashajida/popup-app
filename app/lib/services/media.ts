import { GraphQLClient } from "node_modules/@shopify/shopify-app-remix/dist/ts/server/clients/types";
import { client } from "../db";
import { graphqlClient } from "../graphql-client";

type Media = {
  id: string;
  shop: string;
  fileType: "IMAGE" | "VIDEO";
};

type MediaResponse<T = Media | Media[]> = {
  success: boolean;
  data?: T;
  errorMessage?: string;
  error?: any;
};

//#region Find Images by Shop
const findMediaByShop = async (shop: string) => {
  try {
    const result = await client.media.findMany({
      where: {
        shop: shop,
      },
    });
    return {
      success: true,
      data: result || undefined,
    };
  } catch (error) {
    return {
      success: false,
      errorMessage: "Error finding popups",
      error: error,
    };
  }
};

const queryMediaGq = async (
  fileIds: string[],
  gQClient: GraphQLClient<AdminOperations>,
) => {
  const response = await gQClient(
    `#graphql
     query getFilesByIds($ids: [ID!]!) {
        nodes(ids: $ids) {
          __typename
          ... on MediaImage {
            id
            image {
              url
              altText
            }
          }
          ... on GenericFile {
            id
            alt
            url  
            createdAt
          } 
            ... on Video {
            id
            sources {
              url
              format
              mimeType
            }
          }
        }
    }`,
    {
      variables: {
        ids: fileIds,
      },
    },
  );
  return await response.json();
};

export const getMedia = async (
  shop: string,
  gQClient: GraphQLClient<AdminOperations>,
) => {
  const dbMediaResponse = await findMediaByShop(shop);
  if (!dbMediaResponse.success || !dbMediaResponse.data) {
    return {
      success: false,
      errorMessage: dbMediaResponse.errorMessage,
    };
  }

  const fileIds = dbMediaResponse.data.map((media: Media) => media.id);
  const queryMediaGqResponse = await queryMediaGq(fileIds, gQClient);
  console.log("queryMediaGqResponse 123", queryMediaGqResponse.data.nodes[1]);
  if (!queryMediaGqResponse.data) {
    return {
      success: false,
      errorMessage: "Failed to fetch images from GraphQL",
    };
  }

  const formatted = queryMediaGqResponse.data.nodes
    .map((node: any) => {
      if (node.__typename === "MediaImage") {
        return {
          id: node.id,
          url: node.image?.url,
          altText: node.image?.altText,
          type: "IMAGE",
        };
      } else if (node.__typename === "Video") {
        return {
          id: node.id,
          url: node.sources[0].url,
          type: "VIDEO",
        };
      }
      return null;
    })
    .filter(Boolean);

  return {
    success: true,
    data: formatted,
  };
};
//#endregion

//#region Create Image
export const createMedia = async (data: Media) => {
  console.log("Creating image with data:", data);
  try {
    const result = await client.media.create({
      data: {
        id: data.id,
        shop: data.shop,
        type: data.fileType,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      errorMessage: "Error creating image",
      error: error,
    };
  }
};

export const getAllMedia = async (gQClient: GraphQLClient<AdminOperations>) => {
  try {
    const response = await gQClient(`
  {
  files(first: 10) {
    edges {
      cursor
     node {
       ... on Video {
      filename
      preview {
          image {
            url
          }
        }
      __typename
      sources {
        url
      }
    }
    ... on MediaImage {
      __typename,
      image {
        url
        altText
      }
    }
      
    }
  }
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
  }
    }
`);

    const data = await response.json();

    return {
      pageInfo: data.data.files.pageInfo,
      data: data.data.files.edges.map((edge) => {
        return {
          cursor: edge.cursor,
          file: edge.node,
        };
      }),
    };
  } catch (e) {
    console.log("An error occured:", e);
  }
};


export const getNext = async (cursor: string, gQClient: GraphQLClient<AdminOperations>) => {
  try {
    const response = await gQClient(`
    {
  files(first: 10, after: "${cursor}") {
    edges {
      cursor
     node {
       ... on Video {
      filename
      preview {
          image {
            url
          }
        }
      __typename
      sources {
        url
      }
    }
    ... on MediaImage {
      __typename,
      image {
        url
        altText
      }
    }
      
    }
  }
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
  }
  }
    `)
  const data = await response.json();
  return {
      pageInfo: data.data.files.pageInfo,
      data: data.data.files.edges.map((edge) => {
        return {
          cursor: edge.cursor,
          file: edge.node,
        };
      }),
    };
  } catch(e) {
    console.log("An error occured:", e)
  }
}

export const getPrev = async (cursor: string, gQClient: GraphQLClient<AdminOperations>) => {
  try {
    const response = await gQClient(`
    {
  files(last: 10, before: "${cursor}") {
    edges {
      cursor
     node {
       ... on Video {
      filename
      preview {
          image {
            url
          }
        }
      __typename
      sources {
        url
      }
    }
    ... on MediaImage {
      __typename,
      image {
        url
        altText
      }
    }
      
    }
  }
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
  }
  }
    `)
  const data = await response.json();
  return {
      pageInfo: data.data.files.pageInfo,
      data: data.data.files.edges.map((edge) => {
        return {
          cursor: edge.cursor,
          file: edge.node,
        };
      }),
    };
  } catch(e) {
    console.log("An error occured:", e)
  }
}