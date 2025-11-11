import { LoaderFunctionArgs } from "@remix-run/node";
import { findByShop } from "app/lib/services/popup";
import { getProducts } from "app/lib/services/products";
import { authenticate } from "app/shopify.server";
import { cors } from "remix-utils";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  try {
    const { admin } = await authenticate.public.appProxy(request);

    console.log("called....");

    const shop = params.id;
    if (!shop) {
      return await cors(
        request,
        new Response(
          JSON.stringify({
            success: false,
            errorMessage: "Shop not found",
          }),
        ),
      );
    }
    const result = await findByShop(shop);
    if (!result.success) {
      return await cors(
        request,
        new Response(
          JSON.stringify({
            success: false,
            errorMessage: "Shop not found",
          }),
        ),
      );
    }
    if (!admin) {
      return await cors(
        request,
        new Response(
          JSON.stringify({
            success: false,
            errorMessage: "Shop not found",
          }),
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "GET, OPTIONS",
              "Access-Control-Allow-Headers": "Content-Type",
            },
          },
        ),
      );
    }
    const gQClient = admin.graphql;
    const idList = JSON.parse(result.data?.products || "[]");
    const productsResponse = await getProducts(idList, gQClient);

    if (!productsResponse) {
      return await cors(
        request,
        new Response(
          JSON.stringify({
            success: false,
            errorMessage: "Shop not found",
          }),
        ),
      );
    }

    const style = result.data?.style && JSON.parse(result.data?.style);

    const view = `
      <div class="dialog__container">
             <div class="dialog__products">
            ${productsResponse.data?.map((product) => {
              return `<div class="dialog__product" data-id=${product.variants?.length ?product.variants[0].id.split("/").pop() : ""}>
              <img width="200" src=${product.images?.length ? product.images[0].src : ""} />
                <div class="product__content">
                  <span>${product.title}</span>
                </div>
                <button class="dialog__add-to-bag-icon js-add-to-cart">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-bag" viewBox="0 0 16 16">
                  <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z"/>
                </svg>
                </button>
              </div>`;
            })}
          </div>
        <div class="dialog__image">
          ${renderMedia({
            mediaUrl: result.data?.mediaUrl || "",
            mediaType: result.data?.mediaType || "",
          })}
         <div class="dialog__content">
          <h1 class="dialog__headline">${result.data?.title}</h1>
          <span class="dialog__sub">${result.data?.description}</span>
        </div>
        <style>
          .dialog__headline {
            color: ${style?.title.color};
            font-size: ${style.title.fontSize};
            font-weight: ${style.title.fontWeight};
            line-height: 98%;
            text-align: center;
            margin: 0;
            margin-bottom: 1rem;
          }
          .dialog__sub {
            color: ${style?.description.color};
            font-size: ${style.description.fontSize};
            font-weight: ${style.description.fontWeight};
            text-align: center;
            display: block;
            margin: 0;
          }
        </style>
      </div>
  `;

    const response = new Response(
      JSON.stringify({
        success: true,
        data: view.trim(),
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      },
    );

    await cors(request, response);
    return response;
  } catch (e) {
    return {
      success: false,
      errorMessage: "Error fetching popup 123",
      error: e,
    }
  }
};

const renderMedia = (options: { mediaUrl: string; mediaType: string }) => {
  console.log("media type", options);
  console.log("media url", options.mediaUrl);
  if (options.mediaType == "MediaImage") {
    return `<img src=${options.mediaUrl} />`;
  }

  if (options.mediaType == "Video") {
    return `
    <video autoplay control="false" loop muted>
      <source src=${options.mediaUrl} />
    </video>
    `;
  }
};
