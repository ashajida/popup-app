import { Product } from '@shopify/app-bridge-react';
import { Button } from '@shopify/polaris';

type Props = {
    setSelectedProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}
const ProductPicker = ({setSelectedProducts}: Props) => {
    const handleClick = async () => {
    const selected = await shopify.resourcePicker({type: 'product', multiple: true});
     setSelectedProducts(selected as Product[]);  
    }
  return (
    <Button onClick={handleClick}>Select Product</Button>
  )
}

export default ProductPicker;