"use client";
import { Modal, TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import {
  Button,
  Text,
  Box
} from "@shopify/polaris";
import FileResource, { FileResourceProps } from "./FileResource";
import type { MediaCollectionResponse } from "app/lib/services/media";

export type MediaModalProps = {
  setSelectedMedia: FileResourceProps["setSelectedMedia"];
  setMedia: FileResourceProps["setMedia"];
  media: MediaCollectionResponse["data"];
};

const MediaModal = ({ setSelectedMedia, setMedia, media }: MediaModalProps) => {
  const shopify = useAppBridge();
  return (
    <>
      <Modal id="my-modal">
        <div style={{ padding: "20px", height: "200px" }}>
          <FileResource
            media={media}
            setSelectedMedia={setSelectedMedia}
            setMedia={setMedia}
          />
        </div>
        <TitleBar title="Title">
          <button
            variant="primary"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              console.log("clicked...");
              shopify.modal.hide("my-modal");
            }}
          >
            Save
          </button>
        </TitleBar>
      </Modal>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center", 
              width: "100%",
              marginBottom: "1rem"
             }}>
              <Text as="h2">Select Media</Text>
      <Button onClick={() => shopify.modal.show("my-modal")}>Add Image</Button>
            </div>
    </>
  );
};

export default MediaModal;
