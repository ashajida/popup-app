import { client } from "../db";

type AnalyticsData = {
    shop: string;
    popupId: string;
    eventType: string;
    productId: string
}
export const createAnalytics = async ({shop, productId, popupId, eventType}: AnalyticsData) => {
    try {

        
        const date = new Date();
date.setUTCHours(0,0,0,0);

        console.log('before', {shop, productId, popupId, eventType} )


        const result = await client.analytics.upsert({
            where:{ shop_popupId_productId_eventType_date: {
                popupId,
                productId,
                eventType,
                shop,
                date
            }},
            update: { count: { increment: 1 } },
            create: { popupId, productId, eventType, count: 1, shop, date },
        });


        console.log("prisma results", result)

        if(!result) {
            return {
                success: false,
                errorMessage: "error occured"
            }
        }

        return {
            success: true,
            message: "Created Analytics Successfuly"
        }
    } catch(e) {
        return {
            success: false,
            errorMessage: "Failed to create analytics",
            error: e,
        }
    }
}