import { BlockStack, Text, TextField } from '@shopify/polaris'
import React from 'react'
import type { Schema } from 'app/lib/form-validation'
import type { ActionResponse } from 'app/lib/utils'

type Props = {
  heading?: string; 
  handleHeadingChange: (value: string) => void;
  handleNameChange: (value: string) => void;
  content?:string;
  name: string;
  actionData?: ActionResponse<Partial<Schema>>;
  handleContentChange: (value: string) => void;
}

const PopupForm = ({actionData, handleNameChange, name, handleContentChange , heading, handleHeadingChange, content }:Props) => {
  return (
    <BlockStack gap="400">
      <BlockStack>
              <Text tone="critical" as="span">{!actionData?.success && actionData?.errors?.name}</Text>
              <TextField
                label="Name"
                value={name}
                onChange={handleNameChange}
                autoComplete="off"
                name="name"
              />
           </BlockStack>
           <BlockStack>
            <Text tone="critical" as="span">{!actionData?.success && actionData?.errors?.title}</Text>
            <TextField
              label="Heading"
              value={heading}
              onChange={handleHeadingChange}
              autoComplete="off"
              name="title"
            />
           </BlockStack>
            <BlockStack>
              <Text tone="critical" as="span">{!actionData?.success && actionData?.errors?.description}</Text>
            <TextField
              label="Text"
              value={content}
              onChange={handleContentChange}
              autoComplete="off"
              name="description"
            />
            </BlockStack>
    </BlockStack>
  )
}

export default PopupForm