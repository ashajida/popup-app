import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { createAnalytics } from "app/lib/services/analytics";
import { cors } from "remix-utils";

export const loader = async ({ request, params }: ActionFunctionArgs) => {
    try {
        // const { productId, shop, eventType, popupId } = await request.json();
        // const data = {
        //     productId: productId || "",
        //     shop: shop || "",
        //     eventType: eventType || "",
        //     popupId: popupId|| ""
        // }
        // const result = await createAnalytics(data);

        // if(!result.success) {
        //     return {
        //         success: false,
        //         errorMessage: "Failed to create analytics",
        //     }
        // }

        return cors(
            request,
            new Response(
                JSON.stringify({
                    success: true,
                    message: "Analytics created successfully",
                }),
            ),
        );

    } catch(error) {
        return {
            success: false,
            errorMessage: "Authentication failed",
        }
    }
}
