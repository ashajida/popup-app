import { useFetcher, useLoaderData } from "@remix-run/react";
import {
  Card,
  ResourceItem,
  ResourceList,
  Text,
  Thumbnail,
} from "@shopify/polaris";
import { loader } from "app/routes/app._index";
import React, { useCallback, useEffect, useState } from "react";
import type {ResourceListProps} from '@shopify/polaris';

type Props = {
  setSelectedItems: React.Dispatch<React.SetStateAction<ResourceListProps['selectedItems']>>;
  selectedItems: ResourceListProps['selectedItems'];
}
const FileResource = () => {
  const loaderData = useLoaderData<typeof loader>();
  const [media, setMedia] = useState(loaderData.media || []);
  const [pageData, setPageData] = useState(loaderData.pageInfo || {});
  const fetcher = useFetcher();

  useEffect(() => {
    if (fetcher.data?.media) {
      setMedia(fetcher.data.media); // append new items
      console.log(fetcher.data, 'fetcher data.....')
      setPageData(fetcher.data.pageInfo);
    }
  }, [fetcher.data]);

   const [selectedItems, setSelectedItems] = useState<
    ResourceListProps['selectedItems']
  >([]);

  return (
    <Card>
      <ResourceList
      multiselectable={false}
        resourceName={{ singular: "media", plural: "medias" }}
        items={media}
        pagination={{
          hasNext: pageData.hasNextPage,
          hasPrevious: pageData.hasPreviousPage,
          onNext: async () => {
            setSelectedItems([]); 
            const cursor = media[media.length - 1].cursor;
            const response = await fetcher.submit(
              {
                cursor,
                action: "get-next",
              },
              {
                method: "GET",
              },
            );
            console.log(response, 'next page')
          },
          onPrevious: async () => {
            setSelectedItems([]); 
            const cursor = media[0].cursor;
            const response = await fetcher.submit(
              {
                cursor,
                action: "get-prev",
              },
              {
                method: "GET",
              },
            );
            console.log(response, 'next page')
          }
        }}
        renderItem={(item) => {
          const { cursor, filename } = item;
          const image = item.file.__typename.includes("Image")
            ? item.file.image.url
            : item.file.preview?.image.url;
          return (
            <ResourceItem
              id={cursor}
              media={<Thumbnail source={image} alt="" size="medium" />}
              accessibilityLabel={`View details for ${filename}`}
              url=""
            >
              <Text variant="bodyMd" fontWeight="bold" as="h3">
                {filename}
              </Text>
            </ResourceItem>
          );
        }}
        selectedItems={selectedItems}
        onSelectionChange={(selected) => {
          setSelectedItems([selected[selected.length - 1]]);
        }}
        selectable
        showHeader={false}
      />
    </Card>
  );
};

export default FileResource;
