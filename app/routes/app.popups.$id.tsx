/* eslint-disable */
// export const loader = async () => {}

import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import {
  Form,
  useActionData,
  useFetcher,
  useLoaderData,
  useParams,
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
import { client } from "app/lib/db";
import { graphqlClient } from "app/lib/graphql-client";
import {
  getAllMedia,
  getMedia,
  getMediaById,
  getNext,
  getPrev,
  MediaCollectionResponse,
} from "app/lib/services/media";
import {
  createPopup,
  deleteById,
  findByShopAndId,
  Popup,
  PopupResponse,
  updateById,
} from "app/lib/services/popup";
import { authenticate } from "app/shopify.server";
import { useCallback, useEffect, useRef, useState } from "react";
import { Product as ProductType } from "@shopify/app-bridge-react";
import ProductPicker from "app/components/ProductPicker";
import type { PageProps, ResourceListProps } from "@shopify/polaris";
import { XSmallIcon } from "@shopify/polaris-icons";
import FileResource from "app/components/FileResource";
import type { MediaCollectionsQuery } from "app/types/admin.generated";
import { getProducts } from "app/lib/services/products";
import EnhancedColorPicker from "app/components/EhancedColorPicker";
import PopupForm from "app/components/PopupForm";
import { ActionResponse, validate } from "app/lib/utils";
import { Schema, schema } from "app/lib/form-validation";
import AppearanceSettings from "app/components/AppearanceSettings";
import Products from "app/components/Products";
import Media from "app/components/Media";
import { useFormFields } from "app/lib/hooks/useFormFields";
import { useMedia } from "app/lib/hooks/useMedia";
import { useProduct } from "app/lib/hooks/useProducts";
import { useStatus } from "app/lib/hooks/useStatus";
import { de } from "zod/v4/locales";
import { M } from "node_modules/vite/dist/node/moduleRunnerTransport.d-DJ_mE5sf";
import { useSave } from "app/lib/hooks/useSave";
import { Status } from "app/components/Status";

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
  existingMedia?: MediaCollectionResponse["data"][0];
  existingProducts?: ProductType[] | [];
  existingName: string;
  existingStyle?: Record<string, any>;
};

type StyleObject = {
  title: Style;
  description: Style;
};

type Style = {
  color: string;
  fontSize: string;
  fontWeight: string;
};

type ColorObject = {
  hue: number;
  brightness: number;
  saturation: number;
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const popupId = params.id;

  if (!popupId) {
    return Response.json({
      error: "An error ocured.",
      errerMessage: "Popup not found",
    });
  }

  const formData = await request.formData();

  const action = formData.get("action");

  if (action === "_updatePopup") {
    const actionData = await validate<Schema>(formData, schema);
    console.log("actionData 1", actionData);
    if (!actionData?.success) {
      return Response.json({
        errors: actionData?.errors,
        success: false,
      });
    }
    console.log("action 3");
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
    } = actionData.data;
    const data = {
      mediaUrl,
      mediaType,
      products,
      title: title || "",
      description: description || "",
      shop: session.shop,
      status,
      mediaId,
      mediaCursor,
      style: style || "",
    };

    const result = await updateById(popupId, data, session.shop);
    console.log("update result 1", result);
    return Response.json({
      data: result,
    });
  } else if (action === "_deletePopup") {
    const id = formData.get("id") as string;
    const result = await deleteById(id);
    if (!result.success) {
      return Response.json({
        data: result,
      });
    }
    return redirect("/app");
  }

  return Response.json({
    success: false,
    error: "An error ocured.",
    errerMessage: "Something, somewhere, went wrong",
  });
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const gQClient = await graphqlClient(request);
  const url = new URL(request.url);
  const cursor = url.searchParams.get("cursor");
  const action = url.searchParams.get("action");
  const popupId = params.id!;

  const popup = await findByShopAndId(session.shop, popupId);
  if (!popup.success) {
    return Response.json(popup);
  }

  let existingMedia = await getMediaById(popup.data?.mediaId || "", gQClient);
  existingMedia = existingMedia && {
    data: {
      ...existingMedia.data,
      cursor: popup.data?.mediaCursor || "",
    },
  };
  const existingProducts = await getProducts(
    popup.data?.products ? JSON.parse(popup.data?.products) : [],
    gQClient,
  );

  if (!existingProducts.success) {
    return Response.json(existingProducts);
  }

  const heading = popup.data?.title;
  const description = popup.data?.description;
  const style = popup.data?.style && JSON.parse(popup.data.style);
  const existingName = popup.data?.name;
  const existingStyle = popup.data?.style && JSON.parse(popup.data.style);

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
    status: popup.data?.status || "draft",
    heading,
    description,
    existingMedia: existingMedia?.data,
    existingProducts: existingProducts.success ? existingProducts.data : [],
    existingName,
    existingStyle,
  });
};

const Index = () => {
  const loaderData = useLoaderData<PageState>();
  const fetcher = useFetcher<{ success: boolean }>();
  const submit = useSubmit();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const actionData = useActionData<
    ActionResponse<Partial<Schema>> & {
      data: PopupResponse<Popup>;
    }
  >();
  const style = loaderData.existingStyle;
  const { id } = useParams();
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
  } = useFormFields({
    defaultHeading: loaderData.heading || "",
    defaultContent: loaderData.description || "",
    defaultName: loaderData.existingName || "",
    defaultHeadingFontSize: style?.title?.fontSize
      ? parseInt(style.title.fontSize)
      : 40,
    defaultDescriptionFontSize: style?.description?.fontSize
      ? parseInt(style.description.fontSize)
      : 21,
    defaultHeadingFontWeight: style?.title?.fontWeight || "bold",
    defaultDescriptionFontWeight: style?.description?.fontWeight || "bold",
    defaultHeadingColor: style?.title?.color || "#000000",
    defaultDescriptionColor: style?.description?.color || "#000000",
  });

  const { status, handleStatusChange } = useStatus({
    defaultStatus: loaderData.status || "draft",
  });
  const { selectedMedia, handleSelectedMediaChange, media, handleMediaChange } =
    useMedia({
      defaultMedia: loaderData.media.data as MediaCollectionResponse["data"],
      defaultSelectedMedia: loaderData.existingMedia && loaderData.existingMedia as  MediaCollectionResponse["data"][0]
    });

  const { handleRemoveProduct, selectedProducts, setSelectedProducts } =
    useProduct({ defaultProducts: loaderData.existingProducts || [] });

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

  const deletePopup = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const form = e.currentTarget;
      const formData = new FormData(form);
      submit(formData, {
        method: "DELETE",
      });
    },
    [submit],
  );

  useEffect(() => {
    if (fetcher.data) {
      const result = fetcher.data as ProductActionResponse;
      if (!result.success) {
        console.error(result.errorMessage);
        return;
      }
    }
  }, [fetcher.data]);

  console.log("loaded.....");

  useEffect(() => {
    console.log(actionData, "actionData");
    if (actionData?.data?.success) {
      shopify.toast.show(actionData.data.message!);
    }

    if (actionData?.data?.success == false) {
      shopify.toast.show(actionData.data.message!);
    }
  }, [actionData?.data, actionData?.success]);

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

  return (
    <Page>
      <Box
        style={{
          display: "flex",
          justifyContent: "end",
          gap: "8px",
          marginBottom: "16px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "8px",
          }}
        >
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
          <Form onSubmit={deletePopup}>
            <input hidden value={id} name="id" />
            <input hidden value="_deletePopup" name="action" />

            <Button submit tone="critical">
              Delete
            </Button>
          </Form>
        </div>
      </Box>
      <Form
        ref={formRef}
        method="post"
        onSubmit={handleSaveSubmit}
        style={{ gap: "12px", display: "flex", flexDirection: "column" }}
      >
        <input type="hidden" name="action" value="_updatePopup" />
        <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
          {selected == 0 && (
            <>
              <Box
                style={{
                  display: "flex",
                  justifyContent: "end",
                  gap: "8px",
                  marginBottom: "16px",
                  alignItems: "end",
                }}
              ></Box>
              <BlockStack gap="400">
                <Media
                  actionData={actionData}
                  media={media}
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
