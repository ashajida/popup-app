/* eslint-disable */
// export const loader = async () => {}

import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  Form,
  useActionData,
  useFetcher,
  useLoaderData,
  useSubmit,
} from "@remix-run/react";
import {
  BlockStack,
  Box,
  Button,
  Card,
  Grid,
  Icon,
  MediaCard,
  Page,
  ResourceItem,
  ResourceList,
  Select,
  Tabs,
  Text,
  TextField,
  Thumbnail,
  VideoThumbnail,
} from "@shopify/polaris";
import UploadModel from "app/components/MediaModal";
import { client } from "app/lib/db";
import { graphqlClient } from "app/lib/graphql-client";
import {
  getAllMedia,
  getMedia,
  getNext,
  getPrev,
  MediaCollectionResponse,
} from "app/lib/services/media";
import { createPopup, Popup, PopupResponse } from "app/lib/services/popup";
import { authenticate } from "app/shopify.server";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Modal,
  Product as ProductType,
  TitleBar,
} from "@shopify/app-bridge-react";
import ProductPicker from "app/components/ProductPicker";
import type { ResourceListProps } from "@shopify/polaris";
import { XSmallIcon } from "@shopify/polaris-icons";
import PopupForm from "app/components/PopupForm";
import { ActionResponse, validate } from "app/lib/utils";
import { schema, Schema } from "app/lib/form-validation";
import { set, success } from "zod";
import AppearanceSettings from "app/components/AppearanceSettings";
import Media from "app/components/Media";
import ProductPreview from "app/components/ProductPreview";
import Products from "app/components/Products";
import { useProduct } from "app/lib/hooks/useProducts";
import { useMedia } from "app/lib/hooks/useMedia";
import { useFormFields } from "app/lib/hooks/useFormFields";
import { useStatus } from "app/lib/hooks/useStatus";
import { useHandleSave, useSave } from "app/lib/hooks/useSave";

type ProductGraphQLResponse = {
  id: string;
  title: string;
  descriptionHtml: string;
  images: {
    src: string;
  }[];
  variants: {
    id: string;
    title: string;
    price: string;
  }[];
};

type ProductActionResponse =
  | {
      success: true;
      data: ProductGraphQLResponse;
    }
  | {
      success: false;
      errorMessage: string;
    };

export type PageState = {
  media: MediaCollectionResponse;
  mediaUrl: "";
  status: "draft" | "active";
  selectedProducts?: [];
  selectedMedia?: [];
  heading?: string;
  description?: string;
  pageInfo?: MediaCollectionResponse["pageInfo"];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();
  const action = formData.get("action");
  const actionData = await validate<Schema>(formData, schema);

  if (!actionData?.success) {
    console.log("wok.2", actionData);

    return Response.json({
      errors: actionData?.errors,
      success: false,
    });
  }

  if (action === "_createPopup") {
    const {
      mediaUrl,
      mediaType,
      products,
      title,
      description,
      status,
      mediaId,
      mediaCursor,
      style,
      name,
    } = actionData.data;

    const data = {
      name,
      mediaUrl,
      mediaType,
      products,
      title: title || "",
      description: description || "",
      shop: session.shop,
      status,
      mediaId,
      mediaCursor,
      style: style || "{}",
    };
    console.log("data...123", data);
    const result = await createPopup(data);
    return Response.json({
      data: result,
    });
  }

  return Response.json({
    success: false,
    errorMessage: "Error occurred.",
  });
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const gQClient = await graphqlClient(request);
  const url = new URL(request.url);
  const cursor = url.searchParams.get("cursor");
  const action = url.searchParams.get("action");
  let media: Awaited<MediaCollectionResponse> | undefined;

  if (!action) {
    media = await getAllMedia(gQClient);
  }

  if (action == "get-next") {
    media = await getNext(cursor, gQClient);
    console.log("media next 123", media?.data);
  }

  if (action == "get-prev") {
    media = await getPrev(cursor, gQClient);
  }

  return Response.json({
    media,
    pageInfo: media?.pageInfo,
    shop: session.shop,
    status: "draft",
  });
};

const Index = () => {
  const fetcher = useFetcher<{ success: boolean }>();
  const loaderData = useLoaderData<PageState>();
  const submit = useSubmit();
  const formRef = useRef<HTMLFormElement>(null);
  const {
    heading,
    content,
    name,
    headingFontSize,
    descriptionFontSize,
    headingFontWeight,
    descriptionFontWeight,
    headingColor,
    descriptionColor,
    handleContentChange,
    handleHeadingChange,
    handleNameChange,
    handleDescriptionFontWeightChange,
    descriptionFontSizeSliderChange,
    headingFontSizeSliderChange,
    handleHeadingFontWeightChange,
    handleHeadingColorChange,
    handleDescriptionColorChange,
  } = useFormFields({});

  const { status, handleStatusChange } = useStatus({
    defaultStatus: loaderData.status,
  });

  const actionData = useActionData<
    ActionResponse<Partial<Schema>> & {
      data: PopupResponse<Popup>;
    }
  >();

  useEffect(() => {
    if (actionData?.data?.success) {
      shopify.toast.show(
        actionData.data.message || "Popup created successfully!",
      );
    }
  }, [actionData?.data, actionData?.success]);

  console.log("loaderData media", loaderData.media.data);

  const { selectedMedia, handleSelectedMediaChange, media, handleMediaChange } =
    useMedia({
      defaultMedia:
        (loaderData.media.data as MediaCollectionResponse["data"]) || [],
    });

  const { handleRemoveProduct, selectedProducts, setSelectedProducts } =
    useProduct({});

  const [selected, setSelected] = useState(0);

  const handleTabChange = useCallback(
    (selectedTabIndex: number) => setSelected(selectedTabIndex),
    [],
  );

  const tabs = [
    {
      id: "popup",
      content: "Popup",
      accessibilityLabel: "popup",
      panelID: "popup",
    },
    {
      id: "appearance",
      content: "Appearance",
      accessibilityLabel: "Appearance",
      panelID: "appearance",
    },
  ];

  const { handleSaveSubmit, handleSave } = useSave({
    heading,
    description: content,
    selectedMedia,
    selectedProducts,
    headingColor,
    descriptionColor,
    descriptionFontSize,
    descriptionFontWeight,
    headingFontSize,
    headingFontWeight,
    status,
    name,
    submit,
    formRef,
  });

  useEffect(() => {
    if (fetcher.data) {
      const result = fetcher.data as ProductActionResponse;
      console.log(result);
      if (!result.success) {
        console.error(result.errorMessage, " cannot update product state");
        return;
      }
    }
  }, [fetcher.data]);


  return (
    <Page>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
        <Button
          variant="primary"
          onClick={handleSave}
          textAlign="end"
        >
          Save
        </Button>
      </div>
      <Form
        ref={formRef}
        method="post"
        onSubmit={handleSaveSubmit}
        style={{ gap: "12px", display: "flex", flexDirection: "column" }}
      >
        <input type="hidden" name="action" value="_createPopup" />
        <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
          {selected == 0 && (
            <>
            <Box
                style={{
                  marginBottom: "16px",
                }}
              ></Box>
              <BlockStack gap="400">
                <Media
                  actionData={actionData}
                  media={media || []}
                  selectedMedia={selectedMedia}
                  status={status}
                  setStatus={handleStatusChange}
                  setSelectedMedia={handleSelectedMediaChange}
                  setMedia={handleMediaChange}
                />
                <Card>
                  <PopupForm
                    heading={heading}
                    handleHeadingChange={handleHeadingChange}
                    content={content}
                    name={name}
                    handleNameChange={handleNameChange}
                    handleContentChange={handleContentChange}
                    actionData={actionData}
                  />
                </Card>
                <Products
                  selectedProducts={selectedProducts}
                  handleRemoveProduct={handleRemoveProduct}
                  actionData={actionData}
                  setSelectedProducts={setSelectedProducts}
                />
              </BlockStack>
            </>
          )}
          {selected == 1 && (
            <>
               <Box
                style={{
                  marginBottom: "16px",
                }}
              ></Box>
                          <BlockStack gap="400">
              <Card>
                <BlockStack gap="400">
                  <Text variant="headingLg" as="h2" fontWeight="bold">
                    Heading
                  </Text>
                  <AppearanceSettings
                    color={headingColor}
                    setColor={handleHeadingColorChange}
                    fontSize={headingFontSize}
                    handleFontSizeSliderChange={headingFontSizeSliderChange}
                    fontWeight={headingFontWeight}
                    handleFontWeightChange={handleHeadingFontWeightChange}
                  />
                </BlockStack>
              </Card>
              <Card>
                <BlockStack gap="400">
                  <Text variant="headingLg" as="h2" fontWeight="bold">
                    Description
                  </Text>
                  <AppearanceSettings
                    color={descriptionColor}
                    setColor={handleDescriptionColorChange}
                    fontSize={descriptionFontSize}
                    handleFontSizeSliderChange={descriptionFontSizeSliderChange}
                    fontWeight={descriptionFontWeight}
                    handleFontWeightChange={handleDescriptionFontWeightChange}
                  />
                </BlockStack>
              </Card>
            </BlockStack>
            </>
          )}
        </Tabs>
      </Form>
    </Page>
  );
};

export default Index;