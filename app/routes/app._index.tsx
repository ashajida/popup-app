/* eslint-disable */
// export const loader = async () => {}

import {
  ActionFunctionArgs,
  data,
  LoaderFunctionArgs,
  unstable_createFileUploadHandler,
} from "@remix-run/node";
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
  Icon,
  MediaCard,
  Page,
  ResourceItem,
  ResourceList,
  Text,
  TextField,
  Thumbnail,
  VideoThumbnail,
} from "@shopify/polaris";
import UploadModel from "app/components/UploadModel";
import { client } from "app/lib/db";
import { graphqlClient } from "app/lib/graphql-client";
import {
  getAllMedia,
  getMedia,
  getNext,
  getPrev,
} from "app/lib/services/media";
import { createPopup } from "app/lib/services/popup";
import { getProductByID, getProducts } from "app/lib/services/products";
import { uploadFile } from "app/lib/services/upload";
import { authenticate } from "app/shopify.server";
import { create } from "domain";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { useAppBridge } from "@shopify/app-bridge-react";
import { ResourcePicker } from "@shopify/app-bridge/actions";
import { createApp } from "@shopify/app-bridge/client";
import { Product as ProductType } from "@shopify/app-bridge-react";
import ProductPicker from "app/components/ProductPicker";
import type { ResourceListProps } from "@shopify/polaris";
import { XSmallIcon } from "@shopify/polaris-icons";
import FileResource from "app/components/FileResource";

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

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();
  const file = formData.get("file");
  const gQClient = await graphqlClient(request);

  if (formData.get("action") === "_createPopup") {
    const data = {
      mediaUrl: formData.get("mediaUrl") as string,
      mediaType: formData.get("mediaType") as string,
      products: formData.get("products") as string,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      shop: session.shop,
    };
    console.log("submitted data", data);
    const result = await createPopup(data);
    return Response.json(result);
  }

  if (formData.get("action") === "_uploadFile") {
    if (!file || file instanceof File === false) {
      return Response.json({
        success: false,
        errorMessage: "No file provided",
      });
    }

    const result = await uploadFile(file, gQClient, session.shop);

    return Response.json({
      success: true,
      data: result.data,
    });
  }
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const gQClient = await graphqlClient(request);

  const images = await getMedia(session.shop, gQClient);

  const url = new URL(request.url);
  const cursor = url.searchParams.get("cursor");
  const action = url.searchParams.get("action");
  console.log("cursor...", cursor);
  let media;
  if (!action) {
    media = await getAllMedia(gQClient);
  }

  if (action == "get-next") {
    media = await getNext(cursor, gQClient);
  }

  if (action == "get-prev") {
    media = await getPrev(cursor, gQClient);
  }

  // Fetch products or any other data you need here
  const idList = ["gid://shopify/Product/8168571600941"];

  console.log("images..", images);

  return Response.json({
    images: images.data || [],
    media: media?.data || [],
    pageInfo: media?.pageInfo || {},
  });
};

const Index = () => {
  const [heading, setHeading] = useState("");
  const handleHeadingChange = (newValue: string) => setHeading(newValue);
  const [content, setContent] = useState("");
  const handleContentChange = (newValue: string) => setContent(newValue);
  const [product, setProduct] = useState<Product[]>([]);
  const fetcher = useFetcher<{ success: boolean }>();
  const loaderData = useLoaderData<typeof loader>();
  const submit = useSubmit();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [images, setImages] = useState<
    {
      url: string;
      altText: string;
      id: string;
    }[]
  >(loaderData.images || []);
  const [selectedImage, setSelectedImage] = useState<
    ResourceListProps["selectedItems"]
  >([]);

  const actionData = useActionData<typeof action>();

  const [selectedProducts, setSelectedProducts] = useState<ProductType[]>([]);

  const handleSaveSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const form = e.currentTarget as HTMLFormElement;
      const formData = new FormData(form);
      console.log("images test", selectedImage?.url);
      if (selectedImage) {
        formData.append("mediaUrl", selectedImage.url);
        formData.append("mediaType", selectedImage.type);
      }
      console.log("proudts list", selectedProducts);
      if (selectedProducts.length) {
        formData.append(
          "products",
          JSON.stringify(selectedProducts.map((p) => p.id)),
        );
      }

      submit(formData, { method: "POST" });
    },
    [selectedImage, selectedProducts],
  );

  useEffect(() => {
    if (fetcher.data) {
      const result = fetcher.data as ProductActionResponse;
      if (!result.success) {
        console.error(result.errorMessage);
        return;
      }
      setProduct((prev) => [
        ...prev,
        {
          id: result.data.id,
          title: result.data.title,
          price: result.data.variants[0].price,
        },
      ]);
    }
  }, [fetcher.data]);

  useEffect(() => {
    if (actionData?.success) {
      shopify.toast.show("File uploaded successfully!");
    }
  }, [actionData]);

  const handleSave = useCallback(() => {
    buttonRef.current?.click();
  }, []);

  const renderMedia = (media) => {
    console.log("media", media);
  };

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
        <Button disabled>Preview</Button>
        <Button variant="primary" onClick={handleSave}>
          Save
        </Button>
      </Box>
      <BlockStack>
        <h1>Test</h1>
        <FileResource
         
        />
      </BlockStack>
      <BlockStack gap={400}>
        <Card>
          <Box
            style={{
              display: "flex",
              justifyContent: "end",
            }}
          >
            <UploadModel />
          </Box>
          <Text variant="headingMd" as="h1">
            Media
          </Text>
          {images.length > 0 ? (
            <BlockStack gap={400}>
              {images.map((image) => (
                <div
                  key={image.id}
                  onClick={() => {
                    setSelectedImage(image);
                    alert("clicked...");
                  }}
                >
                  {renderMedia(image)}
                </div>
              ))}
            </BlockStack>
          ) : (
            <Text>No images found</Text>
          )}
        </Card>
        <Card>
          <Form method="post" onSubmit={handleSaveSubmit}>
            <input type="hidden" name="action" value="_createPopup" />
            <TextField
              label="Heading"
              value={heading}
              onChange={handleHeadingChange}
              autoComplete="off"
              name="title"
            />
            <TextField
              label="Text"
              value={content}
              onChange={handleContentChange}
              autoComplete="off"
              name="description"
            />
            <button
              type="submit"
              style={{ display: "none" }}
              hidden
              ref={buttonRef}
            >
              Submit
            </button>
          </Form>
        </Card>
        <Card>
          <Box
            style={{
              display: "flex",
              justifyContent: "end",
            }}
          >
            <ProductPicker setSelectedProducts={setSelectedProducts} />
          </Box>
          <ProductPreview products={selectedProducts} />
        </Card>
      </BlockStack>
    </Page>
  );
};

export default Index;

type ProductPreviewProps = {
  products: ProductType[];
};
const ProductPreview = ({ products }: ProductPreviewProps) => {
  const [localProducts, setLocalProducts] = useState<ProductType[]>([]);
  const [selectedItems, setSelectedItems] = useState<
    ResourceListProps["selectedItems"]
  >([]);
  useEffect(() => {
    setLocalProducts(products);
  }, [products]);
  const handleProductRemove = useCallback((id: string) => {
    setLocalProducts((products) => {
      return products.filter((product) => product.id !== id);
    });
  }, []);

  if (!localProducts.length) {
    return <Text alignment="center">No products selected</Text>;
  }
  return (
    <ResourceList
      resourceName={{ singular: "product", plural: "products" }}
      items={localProducts}
      selectedItems={selectedItems}
      onSelectionChange={setSelectedItems}
      renderItem={(item) => {
        const { id, title, options } = item;
        return (
          <ResourceItem
            id={id}
            key={id}
            accessibilityLabel={`View details for ${title}`}
            name={title}
            onClick={() => console.log(`Clicked on ${title}`)}
          >
            <Box
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Text variant="bodyMd" fontWeight="bold" as="h3">
                {title}
              </Text>
              <Button
                variant="tertiary"
                size="medium"
                onClick={() => handleProductRemove(id)}
              >
                <Icon source={XSmallIcon} tone="base" />
              </Button>
            </Box>
          </ResourceItem>
        );
      }}
    />
  );
};

type PopupPreviewProps = {
  title: string;
  bodyText: string;
  image: string;
  products: Record<string, string>[];
};

const PopupPreview = ({
  title,
  bodyText,
  image,
  products,
}: PopupPreviewProps) => {
  return (
    <div>
      <img src={image} alt="" />
      <div>
        <h1>{title}</h1>
        <p>{bodyText}</p>
      </div>

      {products.map(() => {
        return <div></div>;
      })}
    </div>
  );
};
