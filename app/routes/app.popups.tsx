// export const loader = async () => {}

import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import {
  Badge,
  BlockStack,
  Button,
  Card,
  Page,
  ResourceList,
  ResourceListProps,
  Text,
  TextField,
} from "@shopify/polaris";
import { createPopup, findByShop, findMany } from "app/lib/services/popup";
import { authenticate } from "app/shopify.server";
import { create } from "domain";
import { useState } from "react";

// export const action = async ({request}: ActionFunctionArgs) => {
//   const formData = await request.formData();
//   const { session } = await authenticate.admin(request);
//   const response = await createPopup({
//     heading: formData.get("title") as string,
//     content: formData.get("description") as string,
//     shop: session.shop,
//   });

//   return response;

// };

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const { shop } = session;
  const popups = await findMany(shop);
  return Response.json({
    popups: popups.data ?? [],
  });
};

const Popups = () => {
  const data = useLoaderData<typeof loader>();
  const { popups } = data;
  const [selectedItems, setSelectedItems] = useState<
    ResourceListProps["selectedItems"]
  >([]);
  const resourceName = {
    singular: "Popup",
    plural: "Popups",
  };

  if (!popups.length) {
    return <Text as="h3">There are no popups</Text>;
  }

  return (
    <Page>
      <BlockStack>
        <Card>
          <ResourceList
            resourceName={resourceName}
            items={popups}
            selectedItems={selectedItems}
            onSelectionChange={setSelectedItems}
            selectable
            renderItem={(item) => {
              const { id, title, description } = item;
              return (
                <ResourceList.Item id={id} url={`/app/popups/${id}`}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text as="h3">{title}</Text>
                    <Badge
                      tone="success"
                      progress="complete"
                      toneAndProgressLabelOverride="Status: Published. Your online store is visible."
                    >
                      Published
                    </Badge>
                  </div>
                </ResourceList.Item>
              );
            }}
          />
        </Card>
      </BlockStack>
    </Page>
  );
};

export default Popups;
