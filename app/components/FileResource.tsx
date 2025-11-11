import { useFetcher, useLoaderData } from "@remix-run/react";
import { ResourceItem, ResourceList, Text, Thumbnail } from "@shopify/polaris";
import React, { useEffect, useState } from "react";
import type { ResourceListProps } from "@shopify/polaris";
import type { ResourceListSelectedItems } from "@shopify/polaris/build/ts/src/utilities/resource-list";
import type { MediaCollectionResponse } from "app/lib/services/media";
import type { PageState } from "app/routes/app._index";

export type FileResourceProps = {
  setSelectedMedia: (media: MediaCollectionResponse["data"][0] | undefined) => void;
  setMedia: (media: MediaCollectionResponse["data"]) => void;
  media: MediaCollectionResponse["data"];
};

const FileResource = ({
  setSelectedMedia,
  setMedia,
  media
}: FileResourceProps) => {
  const loaderData = useLoaderData<any>();
  // const [media, setMedia] = useState(loaderData.media.data || []);
  const [pageData, setPageData] = useState(loaderData.pageInfo as PageState['pageInfo']);
  const [selectedItems, setSelectedItems] = useState<ResourceListSelectedItems>(
    [],
  );
  // const [currentMedia, setCurrentMedia] = useState(media || []);
  const fetcher = useFetcher<PageState>();
  useEffect(() => {
    if (fetcher.data?.media) {
      setMedia(fetcher.data.media.data as MediaCollectionResponse["data"]);
      setPageData(fetcher.data.media.pageInfo);
    }

    console.log(fetcher.data?.media, "useEffect");
  }, [fetcher.data?.media, setPageData, setMedia]);

  return (
    <>
      <ResourceList
        selectable={true}
        resourceName={{ singular: "media", plural: "medias" }}
        items={media}
        pagination={{
          hasNext: pageData?.hasNextPage,
          hasPrevious: pageData?.hasPreviousPage,
          onNext: async () => {
            setSelectedItems([]);
            const cursor = media[media.length - 1].cursor;
            await fetcher.submit(
              {
                cursor,
                action: "get-next",
              },
              {
                method: "GET",
              },
            );
          },
          onPrevious: async () => {
            setSelectedItems([]);
            const cursor = media[0].cursor;
            await fetcher.submit(
              {
                cursor,
                action: "get-prev",
              },
              {
                method: "GET",
              },
            );
          },
        }}
        renderItem={(item) => {
          const { cursor, file } = item;
          let image: string | undefined;
          if (file.__typename == "MediaImage") {
            image = file.image?.url;
          } else {
            image = file.preview?.image?.url;
          }
          return (
            <ResourceItem
              id={cursor}
              key={cursor}
              media={<Thumbnail source={image || ""} alt="" size="medium" />}
              accessibilityLabel={`View details for filename`}
              url={
                file.__typename == "MediaImage"
                  ? file.image?.url
                  : file.sources?.[0].url
              }
            >
              <Text variant="bodyMd" fontWeight="bold" as="h3">
                filename
              </Text>
            </ResourceItem>
          );
        }}
        selectedItems={selectedItems}
        onSelectionChange={(selected) => {
          const mediaObj = media.find(
            (item) => item.cursor === selected[selected.length - 1],
          );
          if (!mediaObj) return;
          setSelectedItems([mediaObj.cursor]);
          setSelectedMedia(mediaObj);
          console.log(mediaObj, "mediaObj");
        }}
        showHeader={false}
      />
    </>
  );
};

export default FileResource;
