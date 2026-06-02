import { print, type DocumentNode } from "graphql";
import { addTypenameToDocument } from "@apollo/client/utilities";

import {
  CREATE_ADD_PRODUCT_IN_CART,
  CREATE_CHECKOUT_ADDRESS,
  CREATE_CHECKOUT_ORDER,
  CREATE_CHECKOUT_PAYMENT_METHODS,
  CREATE_CHECKOUT_SHIPPING_METHODS,
  CREATE_CART_TOKEN,
  CREATE_MERGE_CART,
  CREATE_PRODUCT_REVIEW,
  GET_CART_ITEM,
  GET_CHECKOUT_ADDRESSES,
  GET_CHECKOUT_PAYMENT_METHODS,
  GET_CHECKOUT_SHIPPING_RATES,
  REMOVE_CART_ITEM,
  UPDATE_CART_ITEM,
} from "@/graphql";
import { bagistoFetch } from "@/utils/bagisto";
import { getAuthToken } from "@/utils/helper";
import { isBagistoError } from "@/utils/type-guards";

const buildOperations = (
  docs: Record<string, DocumentNode>,
): Record<string, string> =>
  Object.fromEntries(
    Object.entries(docs).map(([name, doc]) => [
      name,
      print(addTypenameToDocument(doc)),
    ]),
  );

const ALLOWED_OPERATIONS = buildOperations({
  createAddProductInCart: CREATE_ADD_PRODUCT_IN_CART,
  RemoveCartItem: REMOVE_CART_ITEM,
  UpdateCartItem: UPDATE_CART_ITEM,
  GetCartItem: GET_CART_ITEM,
  CreateCart: CREATE_CART_TOKEN,
  createMergeCart: CREATE_MERGE_CART,
  collectionGetCheckoutAddresses: GET_CHECKOUT_ADDRESSES,
  CheckoutShippingRates: GET_CHECKOUT_SHIPPING_RATES,
  CheckoutPaymentMethods: GET_CHECKOUT_PAYMENT_METHODS,
  createCheckoutAddress: CREATE_CHECKOUT_ADDRESS,
  CreateCheckoutShippingMethod: CREATE_CHECKOUT_SHIPPING_METHODS,
  CreateCheckoutPaymentMethod: CREATE_CHECKOUT_PAYMENT_METHODS,
  CreateCheckoutOrder: CREATE_CHECKOUT_ORDER,
  CreateProductReview: CREATE_PRODUCT_REVIEW,
});

export async function handleGraphqlProxy(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const { operationName, variables } = body;
    const guestToken = getAuthToken(request);

    if (!operationName || !ALLOWED_OPERATIONS[operationName]) {
      return Response.json(
        {
          message:
            "Invalid or unauthorized operation: " + (operationName || "missing"),
        },
        { status: 400 },
      );
    }

    const query = ALLOWED_OPERATIONS[operationName];
    let finalVariables = variables;

    if (
      operationName === "CheckoutPaymentMethods" ||
      operationName === "CheckoutShippingRates"
    ) {
      finalVariables = { ...variables };
    }

    if (operationName === "CreateCheckoutPaymentMethod") {
      finalVariables = {
        ...variables,
        successUrl: variables?.successUrl ?? `payment/success`,
        failureUrl: variables?.failureUrl ?? `payment/failure`,
        cancelUrl: variables?.cancelUrl ?? `payment/cancel`,
      };
    }

    if (operationName === "createCheckoutAddress" && body.billingFirstName) {
      finalVariables = {
        billingFirstName: body.billingFirstName,
        billingLastName: body.billingLastName,
        billingEmail: body.billingEmail,
        billingAddress: body.billingAddress,
        billingCity: body.billingCity,
        billingCountry: body.billingCountry,
        billingState: body.billingState,
        billingPostcode: body.billingPostcode,
        billingPhoneNumber: body.billingPhoneNumber,
        billingCompanyName: body.billingCompanyName,
        useForShipping: body.useForShipping,
        ...(!body.useForShipping && {
          shippingFirstName: body.shippingFirstName,
          shippingLastName: body.shippingLastName,
          shippingEmail: body.billingEmail,
          shippingAddress: body.shippingAddress,
          shippingCity: body.shippingCity,
          shippingCountry: body.shippingCountry,
          shippingState: body.shippingState,
          shippingPostcode: body.shippingPostcode,
          shippingPhoneNumber: body.shippingPhoneNumber,
          shippingCompanyName: body.shippingCompanyName,
        }),
      };
    }

    if (operationName === "createAddProductInCart" && body.productId) {
      finalVariables = {
        cartId: body.cartId ?? null,
        productId: body.productId,
        quantity: body.quantity,
      };
    }

    const response = await bagistoFetch<{ data: unknown }>({
      query,
      variables: finalVariables,
      cache: "no-store",
      guestToken,
    });

    return Response.json({
      data: response.body.data,
    });
  } catch (error) {
    if (isBagistoError(error)) {
      return Response.json(
        {
          data: null,
          error: error.cause ?? error,
        },
        { status: 200 },
      );
    }

    return Response.json(
      {
        message: "Network error",
        error: error instanceof Error ? error.message : error,
      },
      { status: 500 },
    );
  }
}
