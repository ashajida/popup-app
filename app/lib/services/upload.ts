import { GraphQLClient } from "node_modules/@shopify/shopify-app-remix/dist/ts/server/clients/types";
import { createMedia } from "./media";

export const uploadFile = async (
  file: File,
  gQClient: GraphQLClient<AdminOperations>,
  shop: string,
) => {
  const result = await stagedUploadMutation(file, gQClient);

  if (!file.type.includes("image") && !file.type.includes("video")) {
    return {
      success: false,
      errorMessage: "File type not allowed",
    };
  }

  const fileType = file.type.includes("image") ? "IMAGE" : "VIDEO";

  if (!result.data || !result.data.stagedUploadsCreate) {
    return {
      success: false,
      errorMessage: "Failed to create staged upload",
    };
  }

  const stagedUploadResult = result.data.stagedUploadsCreate.stagedTargets[0];

  const stagedUploadQueryResult = await stagedUploadQuery(
    file,
    stagedUploadResult,
    stagedUploadResult.parameters,
  );

  if (!stagedUploadQueryResult) {
    return {
      success: false,
      errorMessage: "Failed to upload file",
    };
  }

  const fileCreateResult = await fileCreateMutation(
    stagedUploadResult,
    gQClient,
    file,
  );

  if (!fileCreateResult.data) {
    return {
      success: false,
      errorMessage: "Failed to upload file",
    };
  }
  console.log("File created:", fileCreateResult.data.fileCreate.files[0]);
  const createImageDbResponse = await createMedia({
    id: fileCreateResult.data.fileCreate.files[0].id,
    shop: shop,
    fileType,
  });

  if (!createImageDbResponse.success) {
    return {
      success: false,
      errorMessage: "Failed to create image in database",
    };
  }

  return {
    data: fileCreateResult.data.fileCreate.files[0],
    success: true,
  };
};

const stagedUploadQuery = async (
  file: File,
  stagedUploadResult: { url: string; name: string },
  parameters: { name: string; value: string }[],
) => {
  const formData = new FormData();
  parameters.forEach((param) => {
    formData.append(param.name, param.value);
  });
  formData.append("file", file);

  console.log("called", stagedUploadResult);
  const response = await fetch(stagedUploadResult.url, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    return Response.json({
      success: false,
      errorMessage: "Failed to upload file",
    });
  }

  return {
    success: true,
  };
};

const stagedUploadMutation = async (
  file: File,
  gQClient: GraphQLClient<AdminOperations>,
) => {
  const { resource } = getContentType(file.type);
  console.log("resource..", resource);
  try {
    const stagedUploadCreateResponse = await gQClient(
      `#graphql
  mutation stagedUploadsCreate($input: [StagedUploadInput!]!) {
    stagedUploadsCreate(input: $input) {
      stagedTargets {
        url
        resourceUrl
        parameters {
          name
          value
        }
      }
    }
  }`,
      {
        variables: {
          input: [
            {
              filename: file.name,
              mimeType: file.type,
              httpMethod: "POST",
              fileSize: String(file.size),
              resource,
            },
          ],
        },
      },
    );
    return await stagedUploadCreateResponse.json();
  } catch (e) {
    console.log("error found:", e);
  }
};

const fileCreateMutation = async (
  stagedUploadResult: {
    resourceUrl: string;
  },
  gQClient: GraphQLClient<AdminOperations>,
  file: File,
) => {
  console.log("stagedUploadResult", stagedUploadResult);
  const { contentType } = getContentType(file.type);
  const fileCreateResponse = await gQClient(
    `#graphql
  mutation fileCreate($files: [FileCreateInput!]!) {
    fileCreate(files: $files) {
      files {
        id
        fileStatus
        alt
        createdAt
      }
    }
  }`,
    {
      variables: {
        files: {
          alt: "Testing file upload",
          contentType,
          originalSource: stagedUploadResult.resourceUrl,
        },
      },
    },
  );
  return await fileCreateResponse.json();
};

const getContentType = (value: string) => {
  if (value.includes("image")) {
    return {
      contentType: "IMAGE",
      resource: "IMAGE",
    };
  }

  if (value.includes("video")) {
    return {
      contentType: "VIDEO",
      resource: "VIDEO",
    };
  }

  return {
    contentType: "IMAGE",
    resource: "IMAGE",
  };
};
