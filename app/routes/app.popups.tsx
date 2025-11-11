// export const loader = async () => {}

import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import {
  Form,
  Outlet,
  useActionData,
  useLoaderData,
  useMatches,
  useSubmit,
} from "@remix-run/react";
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
import {
  createPopup,
  deleteById,
  findByShop,
  findMany,
  Popup,
  PopupResponse,
} from "app/lib/services/popup";
import { authenticate } from "app/shopify.server";
import { create } from "domain";
import { FormEventHandler, useCallback, useEffect, useState } from "react";
import { DeleteIcon } from "@shopify/polaris-icons";

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

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const action = formData.get("action");
  const id = formData.get("id") as string;

  if (action == "_deletePopup" && id) {
    const result = await deleteById(id);
    console.log(result, "delete 123");
    return Response.json({
      data: result,
    });
  }

  return Response.json({
    data: {},
  });
};

const Popups = () => {
  const data = useLoaderData<typeof loader>();
  const { popups } = data;

  const resourceName = {
    singular: "Popup",
    plural: "Popups",
  };

  const matches = useMatches();

  // Check if the $id route is active
  const isChildRouteActive = matches.some(
    (match) => match.id === "routes/app.popups.$id",
  );

  const actionData = useActionData<{
    data: PopupResponse<Popup>;
  }>();

  const submit = useSubmit();

  useEffect(() => {
    if (actionData?.data.success) {
      shopify.toast.show(actionData.data.message!);
    }

    if (actionData?.data.success == false) {
      shopify.toast.show(actionData.data.message!);
    }
  }, [actionData?.data]);

  const deletePopup = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const form = e.currentTarget;
      const formData = new FormData(form);
      submit(formData, {
        method: "DELETE",
      });
    },
    [submit],
  );

  if (!isChildRouteActive && !popups.length) {
    return <Text as="h3">There are no popups</Text>;
  }

  return (
    <Page>
      {!isChildRouteActive && (
        <BlockStack>
          <Card>
            <ResourceList
              resourceName={resourceName}
              items={popups}
              renderItem={(item) => {
                const { id, title, description, status, name } = item;
                return (
                  <ResourceList.Item id={id} url={`/app/popups/${id}`}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text as="h3">{name}</Text>
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          flexDirection: "row",
                        }}
                      >
                        <Badge
                          tone={status === "active" ? "success" : "neutral"}
                          progress="complete"
                          toneAndProgressLabelOverride="Status: Published. Your online store is visible."
                        >
                          {status}
                        </Badge>
                        <Form onSubmit={deletePopup}>
                          <input hidden value={id} name="id" />
                          <input hidden value="_deletePopup" name="action" />

                          <Button submit tone="critical">
                            Delete
                          </Button>
                        </Form>
                      </div>
                    </div>
                  </ResourceList.Item>
                );
              }}
            />
          </Card>
        </BlockStack>
      )}
      <Outlet />
    </Page>
  );
};

export default Popups;
