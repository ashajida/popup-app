import { Product } from '@shopify/app-bridge-react';
import { Button } from '@shopify/polaris';

export type ProductPickerProps = {
    setSelectedProducts: (products: Product[]) => void;
}
const ProductPicker = ({setSelectedProducts}: ProductPickerProps) => {
    const handleClick = async () => {
    const selected = await shopify.resourcePicker({type: 'product', multiple: true});
    if(!selected?.length) return;
     setSelectedProducts(selected as Product[]);  
    }
  return (
    <Button onClick={handleClick}>Select Product</Button>
  )
}

export default ProductPicker;