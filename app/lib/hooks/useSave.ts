import { useCallback } from 'react';
import type React from 'react';
import type { MediaCollectionResponse } from '../services/media';
import type { Product } from '@shopify/app-bridge-react';
import type { Status } from 'app/components/Status';
import type { SubmitFunction } from '@remix-run/react';
import { de } from 'zod/v4/locales';


type UseSaveProps = {
    selectedMedia?: MediaCollectionResponse["data"][0];
    selectedProducts:  Product[];
    headingColor: string;
    descriptionColor: string;
    descriptionFontSize: number;
    descriptionFontWeight: string;
    headingFontSize: number;
    headingFontWeight: string;
    status: Status;
    name: string;
    description: string;
    heading: string;
    submit: SubmitFunction;
    formRef: React.RefObject<HTMLFormElement>;
}

export const useSave = ({
    selectedMedia,
    selectedProducts,
    headingColor,
    descriptionColor,
    descriptionFontSize,
    descriptionFontWeight,
    headingFontSize,
    headingFontWeight,
    description,
    heading,
    status,
    name,
    submit,
    formRef
}: UseSaveProps) => {
      const handleSaveSubmit = useCallback(
        (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();

          const form = e.currentTarget as HTMLFormElement;
          const formData = new FormData(form);

          if (selectedMedia) {
            if (!selectedMedia?.file) return;
            if (selectedMedia.file.__typename == "MediaImage") {
              formData.append("mediaUrl", selectedMedia.file?.image?.url);
            } else {
              formData.append("mediaUrl", selectedMedia.file.sources[0].url);
            }
            formData.append("mediaType", selectedMedia.file.__typename);
            formData.append("mediaId", selectedMedia.file.id);
            formData.append("mediaCursor", selectedMedia.cursor);
          }
    
          if (selectedProducts.length) {
            formData.append(
              "products",
              JSON.stringify(selectedProducts.map((p) => p.id)),
            );
          }
          formData.append("status", status);
          formData.append("name", name);
          formData.append("description", description);
          formData.append("title", heading);
          formData.append(
            "style",
            JSON.stringify({
              title: {
                color: headingColor,
                fontSize: `${headingFontSize}px`,
                fontWeight: headingFontWeight,
              },
              description: {
                color: descriptionColor,
                fontSize: `${descriptionFontSize}px`,
                fontWeight: descriptionFontWeight,
              },
            }),
          );
          submit(formData, { method: "POST" });
          console.log("sent....");
        },
        [
          selectedMedia,
          selectedProducts,
          headingColor,
          descriptionColor,
          descriptionFontSize,
          descriptionFontWeight,
          headingFontSize,
          headingFontWeight,
          description,
          heading,
          status,
          name,
          submit
        ],
      );

  const handleSave = useCallback(() => {
    formRef.current?.requestSubmit();
  }, [formRef]);


    return {
    handleSaveSubmit,
    handleSave
    }
}

