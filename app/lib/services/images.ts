import { GraphQLClient } from "node_modules/@shopify/shopify-app-remix/dist/ts/server/clients/types";
import { client } from "../db";

type Image = {
    id: string;
    shop: string
}

type ImageResponse<T = Image | Image[]> = {
    success: boolean;
    data?: T;
    errorMessage?: string;
    error?: any;
}

//#region Find Images by Shop
const findImagesByShop = async (shop: string) => {
     try {
        const result = await client.image.findMany({
            where: {
                shop: shop,
            },
        })
        return {
            success: true,
            data: result || undefined
        }
    } catch (error) {
        return {
            success: false,
            errorMessage: "Error finding popups",
            error: error,
        }
    }
}

const queryImagesGq = async (fileIds: string[], gQClient: GraphQLClient<AdminOperations>) => {
    const response = await gQClient(
    `#graphql
      query getFilesByIds($ids: [ID!]!) {
        nodes(ids: $ids) {
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
        }
      }
    `,
    {
      variables: {
        ids: fileIds,
      },
    }
  );
  return await response.json();
}


export const getImages = async (shop: string, gQClient: GraphQLClient<AdminOperations>) => {
    const dbImagesResponse = await findImagesByShop(shop);
    if (!dbImagesResponse.success || !dbImagesResponse.data) {
        return {
            success: false,
            errorMessage: dbImagesResponse.errorMessage,
        };
    }
    const fileIds = dbImagesResponse.data.map((image: Image) => image.id);
    const queryImagesGqResponse = await queryImagesGq(fileIds, gQClient);
    if (!queryImagesGqResponse.data) {
        return {
            success: false,
            errorMessage: "Failed to fetch images from GraphQL",
        };
    }
    return {
        success: true,
        data: queryImagesGqResponse.data.nodes.map((node: any) => ({
            id: node.id,
            url: node.image?.url || node.url,
            altText: node.image?.altText || node.alt,
        })),
    };

}
//#endregion

//#region Create Image 
export const createImage = async (data: Image) => {
    console.log("Creating image with data:", data);
    try {
        const result = await client.image.create({
            data: {
                id: data.id,
                shop: data.shop,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        })
    return {
        success: true,
        data: result,
    }

    } catch (error) {
        return {
            success: false,
            errorMessage: "Error creating image",
            error: error,
        }
    }
    
}