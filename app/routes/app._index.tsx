//ts-ignore
// export const loader = async () => {}

import {
  ActionFunctionArgs,
  data,
  LoaderFunctionArgs,
  unstable_createFileUploadHandler,
} from "@remix-run/node";
import { Form, useActionData, useFetcher, useLoaderData, useSubmit } from "@remix-run/react";
import {
  BlockStack,
  Box,
  Button,
  Card,
  DropZone,
  InlineGrid,
  LegacyStack,
  Page,
  Text,
  TextField,
  Thumbnail,
} from "@shopify/polaris";
import UploadModel from "app/components/UploadModel";
import { client } from "app/lib/db";
import { graphqlClient } from "app/lib/graphql-client";
import { getImages } from "app/lib/services/images";
import { createPopup } from "app/lib/services/popup";
import { getProductByID } from "app/lib/services/products";
import { uploadFile } from "app/lib/services/upload";
import { authenticate } from "app/shopify.server";
import { create } from "domain";
import { get } from "http";
import { FormEvent, useCallback, useEffect, useState } from "react";

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

  // if (formData.get("action") === "_addProduct") {
  //   const id = formData.get("id") as string;
  //   const result = await getProductByID(id, gQClient);
  //   return Response.json(result);
  // }

  if (formData.get("action") === "_uploadFile") {
    if (!file || file instanceof File === false) {
      return Response.json({
        success: false,
        errorMessage: "No file provided",
      });
    }

    const result = await uploadFile(
      file,
      gQClient,
      session.shop,
    );

    return Response.json({
      success: true,
      data: result.data,
    });
  }
  // const response = await uploadFile(file, gQClient);
  // return Response.json({
  //   success: true,
  //   data: response.data,
  //   errors: response.errors,
  // });

  // return Response.json({
  //   success: false,
  //   errorMessage: "Invalid action",
  //   action: formData.get("action"),
  // });

  // const response = await createPopup({
  //   title: formData.get("title") as string,
  //   description: formData.get("description") as string,
  //   shop: session.shop,
  // });

  // return response;
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const gQClient = await graphqlClient(request);

  const images = await getImages(session.shop, gQClient);

  // Fetch products or any other data you need here
  // const products = await getProducts(session.shop, gQClient);

  return Response.json({
    images: images.data || [],
  });
}

const Index = () => {
  const [heading, setHeading] = useState("");
  const handleHeadingChange = (newValue: string) => setHeading(newValue);
  const [content, setContent] = useState("");
  const handleContentChange = (newValue: string) => setContent(newValue);
  const [productIds, setProductIds] = useState("");
  const handleProductIdsChange = (newValue: string) => setProductIds(newValue);
  const [product, setProduct] = useState<Product[]>([]);
  const fetcher = useFetcher<{ success: boolean }>();
  const loaderData = useLoaderData<typeof loader>();
  const [images, setImages] = useState<{
    url: string;
    altText: string;
    id: string;
  }[]>(loaderData.images || []);
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    altText: string;
    id: string;
  } | null>(null);

  const actionData = useActionData<typeof action>();

  const addProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    fetcher.submit(formData);
  };

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

  return (
    <Page>
      <Card>
        <Text variant="headingMd" as="h1">
          Select Image
        </Text>
        {
          images.length > 0 ? (
            <BlockStack >
              {images.map((image) => (
                <div onClick={() => {
                    setSelectedImage(image);
                  }}>
                <Thumbnail
                  key={image.id}
                  source={image.url}
                  alt={image.altText}
                  size="medium"
                />
                </div>
              ))}
            </BlockStack>
          ) : (
            <Text>No images found</Text>
          )
        }
      </Card>
      <BlockStack>
        <Text>Welcome to My App</Text>
        <Form method="post">
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
          <input type="text" name="image" value={selectedImage?.id || ''} hidden />
        </Form>
        {/* <fetcher.Form method="POST" onSubmit={addProduct}>
          <TextField
            label="Text"
            value={productIds}
            onChange={handleProductIdsChange}
            autoComplete="off"
            name="id"
          />
          <div
            style={{
              display: "none",
              visibility: "hidden",
            }}
          >
            <TextField
              label="Product ID"
              value="_addProduct"
              name="action"
              labelHidden
            />
          </div>

          <Button submit>Add Product</Button>
        </fetcher.Form> */}
        <InlineGrid columns={3} gap="4">
          {product.map((product) => (
            <ProductPreview key={product.id} product={product} />
          ))}
        </InlineGrid>
      </BlockStack>
      <UploadModel />
    </Page>
  );
};

export default Index;

type Product = {
  img?: string;
  title: string;
  price: string;
  id: string;
};

type ProductPreviewProps = {
  product: Product;
};
const ProductPreview = ({
  product: { id, title, price },
}: ProductPreviewProps) => {
  return (
    <Card>
      <img src="" />
      <Text>{title}</Text>
      <Text>{price}</Text>
    </Card>
  );
};
