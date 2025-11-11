import type {
  Product 
} from "@shopify/app-bridge-react";
import { Box, Button, Icon, ResourceItem, ResourceList, ResourceListProps, Text, Thumbnail } from "@shopify/polaris";
import { XSmallIcon } from "@shopify/polaris-icons";
import { useState, useEffect } from "react";

export type ProductPreviewProps = {
  products: Product[];
  setProducts: (id: string) => void;
};
const ProductPreview = ({ products, setProducts }: ProductPreviewProps) => {
  const [localProducts, setLocalProducts] = useState<Product[]>([]);
  const [selectedItems, setSelectedItems] = useState<
    ResourceListProps["selectedItems"]
  >([]);
  useEffect(() => {
    setLocalProducts(products);
  }, [products]);
  // const handleProductRemove = useCallback((id: string) => {
  //   setLocalProducts((products) => {
  //     return products.filter((product) => product.id !== id);
  //   });
  // }, []);

  if (!localProducts.length) {
    return (
      <Text alignment="center" as="h2">
        No products selected
      </Text>
    );
  }
  return (
    <ResourceList
      resourceName={{ singular: "product", plural: "products" }}
      items={localProducts}
      selectedItems={selectedItems}
      onSelectionChange={setSelectedItems}
      renderItem={(item) => {
        const { id, title, options, images } = item;
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
              <Box
                style={{
                  display: "flex",
                  gap: "8px",
                  alignItems: "center",
                }}
              >
                <Thumbnail source={images[0].originalSrc} size="small" alt="" />
                <Text variant="bodyMd" fontWeight="bold" as="h3">
                  {title}
                </Text>
              </Box>
              <Button
                variant="tertiary"
                size="medium"
                onClick={() => setProducts(id)}
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

export default ProductPreview;

