/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import type * as AdminTypes from './admin.types';

export type GetFilesByIdsQueryVariables = AdminTypes.Exact<{
  ids: Array<AdminTypes.Scalars['ID']['input']> | AdminTypes.Scalars['ID']['input'];
}>;


export type GetFilesByIdsQuery = { nodes: Array<AdminTypes.Maybe<{ __typename: 'AbandonedCheckout' | 'AbandonedCheckoutLineItem' | 'Abandonment' | 'AddAllProductsOperation' | 'AdditionalFee' | 'App' | 'AppCatalog' | 'AppCredit' | 'AppInstallation' | 'AppPurchaseOneTime' | 'AppRevenueAttributionRecord' | 'AppSubscription' | 'AppUsageRecord' | 'Article' | 'BasicEvent' | 'Blog' | 'BulkOperation' | 'BusinessEntity' | 'CalculatedOrder' | 'CartTransform' } | { __typename: 'CashTrackingAdjustment' | 'CashTrackingSession' | 'CatalogCsvOperation' | 'Channel' | 'ChannelDefinition' | 'ChannelInformation' | 'CheckoutProfile' | 'Collection' | 'Comment' | 'CommentEvent' | 'Company' | 'CompanyAddress' | 'CompanyContact' | 'CompanyContactRole' | 'CompanyContactRoleAssignment' | 'CompanyLocation' | 'CompanyLocationCatalog' | 'CompanyLocationStaffMemberAssignment' | 'ConsentPolicy' | 'Customer' } | { __typename: 'CustomerAccountAppExtensionPage' | 'CustomerAccountNativePage' | 'CustomerPaymentMethod' | 'CustomerSegmentMembersQuery' | 'CustomerVisit' | 'DeliveryCarrierService' | 'DeliveryCondition' | 'DeliveryCountry' | 'DeliveryCustomization' | 'DeliveryLocationGroup' | 'DeliveryMethod' | 'DeliveryMethodDefinition' | 'DeliveryParticipant' | 'DeliveryProfile' | 'DeliveryProfileItem' | 'DeliveryPromiseParticipant' | 'DeliveryPromiseProvider' | 'DeliveryProvince' | 'DeliveryRateDefinition' | 'DeliveryZone' } | { __typename: 'DiscountAutomaticBxgy' | 'DiscountAutomaticNode' | 'DiscountCodeNode' | 'DiscountNode' | 'DiscountRedeemCodeBulkCreation' | 'Domain' | 'DraftOrder' | 'DraftOrderLineItem' | 'DraftOrderTag' | 'Duty' | 'ExchangeLineItem' | 'ExchangeV2' | 'ExternalVideo' | 'Fulfillment' | 'FulfillmentConstraintRule' | 'FulfillmentEvent' | 'FulfillmentHold' | 'FulfillmentLineItem' | 'FulfillmentOrder' | 'FulfillmentOrderDestination' } | { __typename: 'FulfillmentOrderLineItem' | 'FulfillmentOrderMerchantRequest' | 'GiftCard' | 'GiftCardCreditTransaction' | 'GiftCardDebitTransaction' | 'InventoryAdjustmentGroup' | 'InventoryItem' | 'InventoryItemMeasurement' | 'InventoryLevel' | 'InventoryQuantity' | 'LineItem' | 'LineItemGroup' | 'Location' | 'MailingAddress' | 'Market' | 'MarketCatalog' | 'MarketRegionCountry' | 'MarketWebPresence' | 'MarketingActivity' | 'MarketingEvent' } | { __typename: 'Menu' | 'Metafield' | 'MetafieldDefinition' | 'Metaobject' | 'MetaobjectDefinition' | 'Model3d' | 'OnlineStoreTheme' | 'Order' | 'OrderAdjustment' | 'OrderDisputeSummary' | 'OrderTransaction' | 'Page' | 'PaymentCustomization' | 'PaymentMandate' | 'PaymentSchedule' | 'PaymentTerms' | 'PaymentTermsTemplate' | 'PriceList' | 'PriceRule' | 'PriceRuleDiscountCode' } | { __typename: 'Product' | 'ProductBundleOperation' | 'ProductDeleteOperation' | 'ProductDuplicateOperation' | 'ProductFeed' | 'ProductOption' | 'ProductOptionValue' | 'ProductSetOperation' | 'ProductTaxonomyNode' | 'ProductVariant' | 'ProductVariantComponent' | 'Publication' | 'PublicationResourceOperation' | 'QuantityPriceBreak' | 'Refund' | 'RefundShippingLine' | 'Return' | 'ReturnLineItem' | 'ReturnableFulfillment' | 'ReverseDelivery' } | { __typename: 'ReverseDeliveryLineItem' | 'ReverseFulfillmentOrder' | 'ReverseFulfillmentOrderDisposition' | 'ReverseFulfillmentOrderLineItem' | 'SaleAdditionalFee' | 'SavedSearch' | 'ScriptTag' | 'Segment' | 'SellingPlan' | 'SellingPlanGroup' | 'ServerPixel' | 'Shop' | 'ShopAddress' | 'ShopPolicy' | 'ShopifyPaymentsAccount' | 'ShopifyPaymentsBalanceTransaction' | 'ShopifyPaymentsBankAccount' | 'ShopifyPaymentsDispute' | 'ShopifyPaymentsDisputeEvidence' | 'ShopifyPaymentsDisputeFileUpload' } | { __typename: 'ShopifyPaymentsDisputeFulfillment' | 'ShopifyPaymentsPayout' | 'StaffMember' | 'StandardMetafieldDefinitionTemplate' | 'StoreCreditAccount' | 'StoreCreditAccountCreditTransaction' | 'StoreCreditAccountDebitRevertTransaction' | 'StoreCreditAccountDebitTransaction' | 'StorefrontAccessToken' | 'SubscriptionBillingAttempt' | 'SubscriptionContract' | 'SubscriptionDraft' | 'TaxonomyAttribute' | 'TaxonomyCategory' | 'TaxonomyChoiceListAttribute' | 'TaxonomyMeasurementAttribute' | 'TaxonomyValue' | 'TenderTransaction' | 'TransactionFee' | 'UnverifiedReturnLineItem' } | { __typename: 'UrlRedirect' | 'UrlRedirectImport' | 'Validation' | 'WebPixel' | 'WebhookSubscription' } | (
    { __typename: 'GenericFile' }
    & Pick<AdminTypes.GenericFile, 'id' | 'alt' | 'url' | 'createdAt'>
  ) | (
    { __typename: 'MediaImage' }
    & Pick<AdminTypes.MediaImage, 'id'>
    & { image?: AdminTypes.Maybe<Pick<AdminTypes.Image, 'url' | 'altText'>> }
  ) | (
    { __typename: 'Video' }
    & Pick<AdminTypes.Video, 'id'>
    & { sources: Array<Pick<AdminTypes.VideoSource, 'url' | 'format' | 'mimeType'>> }
  )>> };

export type MediaCollectionsQueryVariables = AdminTypes.Exact<{
  cursor?: AdminTypes.InputMaybe<AdminTypes.Scalars['String']['input']>;
}>;


export type MediaCollectionsQuery = { files: { edges: Array<(
      Pick<AdminTypes.FileEdge, 'cursor'>
      & { node: (
        { __typename: 'MediaImage' }
        & Pick<AdminTypes.MediaImage, 'id'>
        & { image?: AdminTypes.Maybe<Pick<AdminTypes.Image, 'url' | 'altText'>> }
      ) | (
        { __typename: 'Video' }
        & Pick<AdminTypes.Video, 'id' | 'filename'>
        & { preview?: AdminTypes.Maybe<{ image?: AdminTypes.Maybe<Pick<AdminTypes.Image, 'url'>> }>, sources: Array<Pick<AdminTypes.VideoSource, 'url'>> }
      ) }
    )>, pageInfo: Pick<AdminTypes.PageInfo, 'hasNextPage' | 'startCursor' | 'endCursor' | 'hasPreviousPage'> } };

export type GetNextFilesQueryVariables = AdminTypes.Exact<{
  cursor?: AdminTypes.InputMaybe<AdminTypes.Scalars['String']['input']>;
}>;


export type GetNextFilesQuery = { files: { edges: Array<(
      Pick<AdminTypes.FileEdge, 'cursor'>
      & { node: (
        { __typename: 'MediaImage' }
        & Pick<AdminTypes.MediaImage, 'id'>
        & { image?: AdminTypes.Maybe<Pick<AdminTypes.Image, 'url' | 'altText'>> }
      ) | (
        { __typename: 'Video' }
        & Pick<AdminTypes.Video, 'id' | 'filename'>
        & { preview?: AdminTypes.Maybe<{ image?: AdminTypes.Maybe<Pick<AdminTypes.Image, 'url'>> }>, sources: Array<Pick<AdminTypes.VideoSource, 'url'>> }
      ) }
    )>, pageInfo: Pick<AdminTypes.PageInfo, 'hasNextPage' | 'hasPreviousPage'> } };

export type GetPrevFilesQueryVariables = AdminTypes.Exact<{
  cursor?: AdminTypes.InputMaybe<AdminTypes.Scalars['String']['input']>;
}>;


export type GetPrevFilesQuery = { files: { edges: Array<(
      Pick<AdminTypes.FileEdge, 'cursor'>
      & { node: (
        { __typename: 'MediaImage' }
        & Pick<AdminTypes.MediaImage, 'id'>
        & { image?: AdminTypes.Maybe<Pick<AdminTypes.Image, 'url' | 'altText'>> }
      ) | (
        { __typename: 'Video' }
        & Pick<AdminTypes.Video, 'id' | 'filename'>
        & { preview?: AdminTypes.Maybe<{ image?: AdminTypes.Maybe<Pick<AdminTypes.Image, 'url'>> }>, sources: Array<Pick<AdminTypes.VideoSource, 'url'>> }
      ) }
    )>, pageInfo: Pick<AdminTypes.PageInfo, 'hasNextPage' | 'hasPreviousPage'> } };

export type MediaByIdQueryVariables = AdminTypes.Exact<{
  id: AdminTypes.Scalars['ID']['input'];
}>;


export type MediaByIdQuery = { node?: AdminTypes.Maybe<(
    { __typename: 'MediaImage' }
    & Pick<AdminTypes.MediaImage, 'id'>
    & { image?: AdminTypes.Maybe<Pick<AdminTypes.Image, 'url' | 'altText'>> }
  ) | (
    { __typename: 'Video' }
    & Pick<AdminTypes.Video, 'id' | 'filename'>
    & { preview?: AdminTypes.Maybe<{ image?: AdminTypes.Maybe<Pick<AdminTypes.Image, 'url'>> }>, sources: Array<Pick<AdminTypes.VideoSource, 'url'>> }
  )> };

export type GetProductsQueryVariables = AdminTypes.Exact<{
  ids: Array<AdminTypes.Scalars['ID']['input']> | AdminTypes.Scalars['ID']['input'];
}>;


export type GetProductsQuery = { nodes: Array<AdminTypes.Maybe<(
    Pick<AdminTypes.Product, 'id' | 'title' | 'descriptionHtml'>
    & { images: { edges: Array<{ node: Pick<AdminTypes.Image, 'src'> }> }, variants: { edges: Array<{ node: Pick<AdminTypes.ProductVariant, 'id' | 'title' | 'price'> }> } }
  )>> };

interface GeneratedQueryTypes {
  "#graphql\n     query getFilesByIds($ids: [ID!]!) {\n        nodes(ids: $ids) {\n          __typename\n          ... on MediaImage {\n            id\n            image {\n              url\n              altText\n            }\n          }\n          ... on GenericFile {\n            id\n            alt\n            url  \n            createdAt\n          } \n            ... on Video {\n            id\n            sources {\n              url\n              format\n              mimeType\n            }\n          }\n        }\n    }": {return: GetFilesByIdsQuery, variables: GetFilesByIdsQueryVariables},
  "#graphql \nquery MediaCollections($cursor: String) {\n  files(first: 10, after: $cursor) {\n    edges {\n      cursor\n     node {\n       ... on Video {\n       id\n      filename\n      preview {\n          image {\n            url\n          }\n        }\n      __typename\n      sources {\n        url\n      }\n    }\n    ... on MediaImage {\n    id\n      __typename\n      image {\n        url\n        altText\n      }\n    }\n      \n    }\n  }\n    pageInfo {\n      hasNextPage\n      startCursor\n      endCursor\n      hasPreviousPage\n    }\n  }\n    }\n": {return: MediaCollectionsQuery, variables: MediaCollectionsQueryVariables},
  "#graphql \n  query getNextFiles($cursor: String){\n  files(first: 10, after: $cursor) {\n    edges {\n         cursor\n     node {\n       ... on Video {\n       id\n      filename\n      preview {\n          image {\n            url\n          }\n        }\n      __typename\n      sources {\n        url\n      }\n    }\n    ... on MediaImage {\n    id\n      __typename\n      image {\n        url\n        altText\n      }\n    }\n      \n    }\n  }\n    pageInfo {\n      hasNextPage\n      hasPreviousPage\n    }\n  }\n  }\n    ": {return: GetNextFilesQuery, variables: GetNextFilesQueryVariables},
  "#graphql\n    query getPrevFiles($cursor: String){\n  files(last: 10, before: $cursor) {\n    edges {\n          cursor\n     node {\n       ... on Video {\n       id\n      filename\n      preview {\n          image {\n            url\n          }\n        }\n      __typename\n      sources {\n        url\n      }\n    }\n    ... on MediaImage {\n    id\n      __typename\n      image {\n        url\n        altText\n      }\n    }\n      \n    }\n  }\n    pageInfo {\n      hasNextPage\n      hasPreviousPage\n    }\n  }\n  }\n    ": {return: GetPrevFilesQuery, variables: GetPrevFilesQueryVariables},
  "#graphql \n  query MediaById($id: ID!) {\n    node(id: $id) {\n      ... on Video {\n        id\n        filename\n        preview {\n          image {\n            url\n          }\n        }\n        __typename\n        sources {\n          url\n        }\n      }\n      ... on MediaImage {\n        id\n        __typename\n        image {\n          url\n          altText\n        }\n      }\n    }\n  }\n": {return: MediaByIdQuery, variables: MediaByIdQueryVariables},
  "#graphql\n  query GetProducts($ids: [ID!]!) {\n      nodes(ids: $ids) {\n        ... on Product {\n          id\n          title\n          descriptionHtml\n          images(first: 1) {\n            edges {\n              node {\n                src\n              }\n            }\n          }\n          variants(first: 10) {\n            edges {\n              node {\n                id\n                title\n                price\n              }\n            }\n          }\n        }\n      }\n    }\n    ": {return: GetProductsQuery, variables: GetProductsQueryVariables},
}

interface GeneratedMutationTypes {
}
declare module '@shopify/admin-api-client' {
  type InputMaybe<T> = AdminTypes.InputMaybe<T>;
  interface AdminQueries extends GeneratedQueryTypes {}
  interface AdminMutations extends GeneratedMutationTypes {}
}
