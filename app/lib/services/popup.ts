import type { Prisma } from "@prisma/client";
import { client } from "../db";

export type Popup = {
  mediaUrl: string | null;
  mediaType: string | null;
  mediaId: string | null;
  title: string | null;
  description: string | null;
  products: string | null;
  status: string;
  shop: string;
  name: string;
  mediaCursor: string | null;
  style: string | null;
};

export type PopupResponse<T = Popup | Popup[]> =
  | PopupResponseSuccess<T>
  | PopupResponseFail;

type PopupResponseSuccess<T = Popup | Popup[]> = {
  success: true;
  message?: string;
  data?: T;
};

type PopupResponseFail = {
  success: false;
  error?: any;
  message: string;
};

export type Style = {
  titleColor: string;
  descriptionColor: string;
};

const defaultStyle = JSON.stringify({
  title: {
    color: "#000000",
    fontSize: "40px",
    fontWeight: "bold",
  },
  description: {
    color: "#000000",
    fontSize: "21px",
    fontWeight: "bold",
  },
});

export const createPopup = async (
  data: Popup,
): Promise<PopupResponse<Popup>> => {
  try {
    if (data.status === "active") {
      await updateMany(data.shop);
    }

    const result = await client.popup.create({
      data: {
        id: crypto.randomUUID(),
        title: data.title,
        description: data.description,
        products: data.products || "",
        mediaUrl: data.mediaUrl || "",
        mediaId: data.mediaId || "",
        mediaType: data.mediaType || "",
        shop: data.shop,
        name: data.name,
        status: data.status || "draft",
        mediaCursor: data.mediaCursor || "",
        style: data.style || defaultStyle,
      },
    });

    console.log("created popup", result);

    if (!result) {
      return {
        success: false,
        message: "Error creating popup",
      };
    }
    return {
      success: true,
      data: result,
      message: "Successfully created popup",
    };
  } catch (error) {
    return {
      success: false,
      message: "Error creating popup",
      error: error,
    };
  }
};

export const findByShopAndId = async (
  shop: string,
  id: string,
): Promise<PopupResponse<Popup>> => {
  try {
    const result = await client.popup.findFirst({
      where: {
        shop: shop,
        id: id,
      },
    });

    if (!result) {
      return {
        success: false,
        message: "Popup not found",
      };
    }
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error finding popup",
      error: error,
    };
  }
};

export const findByShop = async (
  shop: string,
): Promise<PopupResponse<Popup & {id: string}>> => {
  try {
    const result = await client.popup.findFirst({
      where: {
        shop: shop,
        status: "active",
      },
    });

    if (!result) {
      return {
        success: false,
        message: "Popup not found",
      };
    }
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error finding popup",
      error: error,
    };
  }
};

export const findMany = async (
  shop: string,
): Promise<PopupResponse<Popup[]>> => {
  try {
    const result = await client.popup.findMany({
      where: {
        shop: shop,
      },
    });

    if (!result?.length) {
      return {
        success: false,
        message: "No popups found",
      };
    }

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error finding popups",
      error: error,
    };
  }
};

export const updateMany = async (
  shop: string,
): Promise<PopupResponse<Prisma.BatchPayload>> => {
  try {
    const result = await client.popup.updateMany({
      where: {
        shop: shop,
      },
      data: {
        status: "draft",
      },
    });
    return {
      success: true,
      data: result || undefined,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error finding popups",
      error: error,
    };
  }
};

export const updateById = async (
  id: string,
  data: Prisma.PopupUpdateInput,
  shop: string,
): Promise<PopupResponse<Popup>> => {
  try {
    if (data.status === "active") {
      await updateMany(shop);
    }

    const popup = await client.popup.update({
      where: {
        id: id,
      },
      data: data,
    });

    console.log("updated popup", popup);
    if (!popup) {
      return {
        success: false,
        message: "Popup not found",
      };
    }

    return {
      success: true,
      data: popup,
      message: "Successfully updated popup",
    };
  } catch (e) {
    return {
      success: false,
      message: "Error updating popup",
      error: e,
    };
  }
};

export const deleteById = async (id: string): Promise<PopupResponse<Popup>> => {
  try {
    const result = await client.popup.delete({
      where: {
        id,
      },
    });

    if (!result) {
      return {
        success: false,
        message: "Popup not found",
      };
    }

    return {
      success: true,
      data: result,
      message: "Successfully deleted popup",
    };
  } catch (e) {
    return {
      success: false,
      message: "Error deleting popup",
      error: e,
    };
  }
};
