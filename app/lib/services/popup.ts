import { client } from "../db";

type Popup = {
  mediaUrl: string | null;
  mediaType: string | null;
  title: string | null;
  description: string | null;
  products: string | null;
  shop: string;
};

type PopupResponse<T = Popup | Popup[]> = {
  success: boolean;
  data?: T;
  errorMessage?: string;
  error?: any;
};
export const createPopup = async (
  data: Popup,
): Promise<PopupResponse<Popup>> => {
  try {
    const result = await client.popup.create({
      data: {
        id: crypto.randomUUID(),
        title: data.title,
        description: data.description,
        products: data.products || "",
        mediaUrl: data.mediaUrl || "",
        mediaType: data.mediaType || "",
        shop: data.shop,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      errorMessage: "Error creating popup",
      error: error,
    };
  }
};

export const findByShop = async (shop: string): Promise<PopupResponse<Popup>> => {
    try {
        const result = await client.popup.findFirst({
            where: {
                shop: shop,
            },
        })
        return {
            success: true,
            data: result || undefined
        }
    } catch (error) {
        return {
            success: false,
            errorMessage: "Error finding popup",
            error: error,
        }
    }
}

export const findMany = async (shop: string): Promise<PopupResponse<Popup[]>> => {
    try {
        const result = await client.popup.findMany({
            where: {
                shop: shop,
            },
        })
        return {
            success: true,
            data: result || undefined
        }
    } catch (error) {
        return {
            success: false,
            errorMessage: "Error finding popups",
            error: error,
        }
    }
}