import { LoaderFunctionArgs } from "@remix-run/node";
import { findByShop } from "app/lib/services/popup";
import { cors } from "remix-utils";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const shop = params.id;
  if (!shop) {
    return await cors(request, new Response("Shop not found", { status: 404 }));
  }
  const result = await findByShop(shop);

  const response = new Response(JSON.stringify(result), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });

  await cors(request, response);

  return response;
};
