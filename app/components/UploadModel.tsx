"use client";
import { ActionFunctionArgs } from "@remix-run/node";
import { Form, useSubmit } from "@remix-run/react";
import { Modal, TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import {
  BlockStack,
  Button,
  DropZone,
  Thumbnail,
  Text,
  Box,
} from "@shopify/polaris";
import React, { useCallback, useState } from "react";

const UploadModel = () => {
  const shopify = useAppBridge();
  const submit = useSubmit();

  const [files, setFiles] = useState<File[]>([]);
  const [rejectedFiles, setRejectedFiles] = useState<File[]>([]);
  const hasError = rejectedFiles.length > 0;
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const handleDrop = useCallback(
    (_droppedFiles: File[], acceptedFiles: File[], rejectedFiles: File[]) => {
      setFiles((files) => [...files, ...acceptedFiles]);
      setRejectedFiles(rejectedFiles);
    },
    [],
  );

  const handleUploadSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", files[0]);
    formData.append("action", "_uploadFile");
    console.log(formData.get("file"), "formData");

    submit(formData, {
      method: "POST",
      encType: "multipart/form-data",
    });
  };

  const fileUpload = !files.length && <DropZone.FileUpload />;
  const uploadedFiles = files.length > 0 && (
    <>
      {files.map((file, index) => (
        <BlockStack key={index}>
          <Thumbnail
            size="small"
            alt={file.name}
            source={window.URL.createObjectURL(file)}
          />
          <div>
            {file.name}{" "}
            <Text variant="bodySm" as="p">
              {file.size} bytes
            </Text>
          </div>
        </BlockStack>
      ))}
    </>
  );

  return (
    <>
      <Modal id="my-modal">
        <div style={{ padding: "20px", height: "200px" }}>
        <Form
          method="POST"
          encType="multipart/form-data"
          onSubmit={handleUploadSubmit}
        >
            <DropZone allowMultiple={false} accept="image/*" type="image" onDrop={handleDrop}>
              {uploadedFiles}
              {fileUpload}
            </DropZone>
          <input value="_uploadFile" name="action" hidden />
          <button
            type="submit"
            style={{ display: "none" }}
            hidden
            ref={buttonRef}
            >Submit</button>
        </Form>
        </div>
        <TitleBar title="Title">
          <button variant="primary" onClick={() => buttonRef.current?.click()}>Save</button>
        </TitleBar>
      </Modal>

      <Button onClick={() => shopify.modal.show("my-modal")}>Open Modal</Button>
    </>
  );
};

export default UploadModel;
