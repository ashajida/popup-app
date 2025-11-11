import type { GraphQLClient } from "node_modules/@shopify/shopify-app-remix/dist/ts/server/clients/types";
import { client } from "../db";
import type { graphqlClient } from "../graphql-client";
import type { MediaCollectionsQuery } from "app/types/admin.generated";

type Media = {
  id: string;
  shop: string;
  fileType: "IMAGE" | "VIDEO";
};

export type MediaCollectionResponse = {
  pageInfo: MediaCollectionsQuery["files"]["pageInfo"] | undefined;
  data: {
    cursor: string;
    file: MediaCollectionsQuery["files"]["edges"][0]["node"];
  }[];
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

export const getAllMedia = async (
  gQClient: Awaited<ReturnType<typeof graphqlClient>>,
  cursor?: string,
) => {
  try {
    const response = await gQClient(MEDIA_QUERY, {
      variables: { cursor: cursor },
    });

    console.log("running....");

    const data = await response.json();

    console.log("all media data 1234:", data.data);

    return {
      pageInfo: data.data?.files.pageInfo,
      data: data.data?.files.edges.map((edge) => {
        return {
          cursor: edge.cursor,
          file: edge.node,
        };
      }),
    } as MediaCollectionResponse;
  } catch (e) {
    console.log("An error occured:", e);
  }
};

export const getNext = async (
  cursor: string | null,
  gQClient: Awaited<ReturnType<typeof graphqlClient>>,
) => {
  try {
    const response = await gQClient(GET_NEXT_QUERY, {
      variables: { cursor },
    });

    const data = await response.json();
    //console.log("next page data 1234:", cursor , data.data);
    return {
      pageInfo: data.data?.files.pageInfo,
      data: data.data?.files.edges.map((edge) => {
        return {
          cursor: edge.cursor,
          file: edge.node,
        };
      }),
    } as MediaCollectionResponse;
  } catch (e) {
    console.log("An error occured:", e);
  }
};

export const getPrev = async (
  cursor: string | null,
  gQClient: Awaited<ReturnType<typeof graphqlClient>>,
) => {
  try {
    const response = await gQClient(GET_PREV_QUERY, {
      variables: { cursor },
    });
    const data = await response.json();
    return {
      pageInfo: data.data?.files.pageInfo,
      data: data.data?.files.edges.map((edge) => {
        return {
          cursor: edge.cursor,
          file: edge.node,
        };
      }),
    } as MediaCollectionResponse;
  } catch (e) {
    console.log("An error occured:", e);
  }
};

export const getMediaById = async (
  id: string,
  gQClient: Awaited<ReturnType<typeof graphqlClient>>,
) => {
  try {
    const response = await gQClient(GET_MEDIA_BY_ID, {
      variables: { id },
    });
    const data = await response.json();
    return {
      data: {
        file: data.data?.node,
        cursor: "",
      } as MediaCollectionResponse["data"][0],
    };
  } catch (e) {
    console.log("An error occured:", e);
  }
};

export const MEDIA_QUERY = `#graphql 
query MediaCollections($cursor: String) {
  files(first: 10, after: $cursor) {
    edges {
      cursor
     node {
       ... on Video {
       id
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
    id
      __typename
      image {
        url
        altText
      }
    }
      
    }
  }
    pageInfo {
      hasNextPage
      startCursor
      endCursor
      hasPreviousPage
    }
  }
    }
`;

export const GET_NEXT_QUERY = `#graphql 
  query getNextFiles($cursor: String){
  files(first: 10, after: $cursor) {
    edges {
         cursor
     node {
       ... on Video {
       id
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
    id
      __typename
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
    `;

export const GET_PREV_QUERY = `#graphql
    query getPrevFiles($cursor: String){
  files(last: 10, before: $cursor) {
    edges {
          cursor
     node {
       ... on Video {
       id
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
    id
      __typename
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
    `;

export const GET_MEDIA_BY_ID = `#graphql 
  query MediaById($id: ID!) {
    node(id: $id) {
      ... on Video {
        id
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
        id
        __typename
        image {
          url
          altText
        }
      }
    }
  }
`;
