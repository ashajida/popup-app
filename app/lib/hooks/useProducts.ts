import type { Product } from "@shopify/app-bridge-react";
import { useCallback, useState } from "react";

type UseProductProps = {
    defaultProducts?: Product[];
};

export const useProduct = ({defaultProducts}: UseProductProps) => {
   const [selectedProducts, setSelectedProducts] = useState<Product[]>(defaultProducts || []);

   const handleRemoveProduct = useCallback(
    (id: string) => {
      setSelectedProducts((products) => {
        return products.filter((product) => product.id !== id);
      });
    },
    [setSelectedProducts],
  );

   return {
    selectedProducts,
    setSelectedProducts,
    handleRemoveProduct,
   }
}


