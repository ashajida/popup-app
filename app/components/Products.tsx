import { Card, Box, Text } from '@shopify/polaris'
import ProductPicker from './ProductPicker';
import type { ProductPickerProps } from './ProductPicker'
import ProductPreview  from './ProductPreview';
import type { ProductPreviewProps } from './ProductPreview';

type ProductProps = {
    setSelectedProducts: ProductPickerProps["setSelectedProducts"];
    selectedProducts: ProductPreviewProps["products"];
    handleRemoveProduct: ProductPreviewProps["setProducts"];
    actionData?: any;
}
const Products = ({actionData, selectedProducts, handleRemoveProduct, setSelectedProducts}: ProductProps) => {
  return (
    <Card>
        <Text tone="critical" as="span">
        {!actionData?.success && actionData?.errors?.products}
        </Text>
        <Box
        style={{
            display: "flex",
            justifyContent: "end",
        }}
        >
        <ProductPicker setSelectedProducts={setSelectedProducts} />
        </Box>
        <ProductPreview
        products={selectedProducts}
        setProducts={handleRemoveProduct}
        />
    </Card>
  )
}

export default Products