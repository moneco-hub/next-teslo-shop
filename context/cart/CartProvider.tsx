import { FC, useEffect, useReducer } from "react";
import Cookie from "js-cookie";
import axios, { AxiosError } from "axios";

import { ICartProduct, IOrder, IShippingAddress } from "../../interfaces";
import { CartContext, cartReducer } from "./";
import Cookies from "js-cookie";
import { tesloApi } from "../../api";

export interface CartState {
  isLoaded: boolean;
  cart: ICartProduct[];
  numberOfItems: number;
  subTotal: number;
  tax: number;
  total: number;
  shippingAddress?: IShippingAddress;
}

const CART_INITIAL_STATE: CartState = {
  isLoaded: false,
  cart: [],
  numberOfItems: 0,
  subTotal: 0,
  tax: 0,
  total: 0,
  shippingAddress: undefined,
};

interface Props {
  children: JSX.Element;
}

export const CartProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);

  useEffect(() => {
    try {
      const cookieProducts = Cookie.get("cart") ? JSON.parse(Cookie.get("cart")!) : [];
      dispatch({ type: "[Cart] - Load Cart From Cookies | Storage", payload: cookieProducts });
    } catch (error) {
      dispatch({ type: "[Cart] - Load Cart From Cookies | Storage", payload: [] });
    }
  }, []);

  useEffect(() => {
    if (Cookies.get("firstName") === undefined) {
      return;
    }

    const shippingAddress: IShippingAddress = {
      firstName: Cookies.get("firstName") || "",
      lastName: Cookies.get("lastName") || "",
      address: Cookies.get("address") || "",
      address2: Cookies.get("address2") || "",
      zip: Cookies.get("zip") || "",
      city: Cookies.get("city") || "",
      country: Cookies.get("country") || "",
      phone: Cookies.get("phone") || "",
    };

    dispatch({ type: "[Cart] - Load address from cookies", payload: shippingAddress });
  }, []);

  useEffect(() => {
    Cookie.set("cart", JSON.stringify(state.cart));
  }, [state.cart]);

  useEffect(() => {
    const numberOfItems = state.cart.reduce((prev: number, current: ICartProduct) => current.quantity + prev, 0);
    const subTotal = state.cart.reduce((prev: number, current: ICartProduct) => current.quantity * current.price + prev, 0);
    const taxRate = 0.15;

    const orderSummary = {
      numberOfItems,
      subTotal,
      tax: subTotal * taxRate,
      total: subTotal * (1 + taxRate),
    };

    dispatch({ type: "[Cart] - Update order summary", payload: orderSummary });
  }, [state.cart]);

  const addProductToCart = (product: ICartProduct) => {
    const productInCart = state.cart.some((p) => p._id === product._id);
    if (!productInCart) return dispatch({ type: "[Cart] - Update products in cart", payload: [...state.cart, product] });

    const productInCartButDifferentSize = state.cart.some((p) => p._id === product._id && p.size === product.size);
    if (!productInCartButDifferentSize)
      return dispatch({ type: "[Cart] - Update products in cart", payload: [...state.cart, product] });

    //Cumulate
    const updatedProducts = state.cart.map((p) => {
      if (p._id !== product._id) return p;
      if (p.size !== product.size) return p;

      //Update quanty
      p.quantity += product.quantity;

      return p;
    });

    dispatch({ type: "[Cart] - Update products in cart", payload: updatedProducts });
  };

  const updateCartQuantity = (product: ICartProduct) => {
    dispatch({ type: "[Cart] - Update product quantity", payload: product });
  };

  const removeCartProduct = (product: ICartProduct) => {
    dispatch({ type: "[Cart] - Remove product in cart", payload: product });
  };

  const updateAddress = (address: IShippingAddress) => {
    Cookies.set("firstName", address.firstName);
    Cookies.set("lastName", address.lastName);
    Cookies.set("address", address.address);
    Cookies.set("address2", address.address2 || "");
    Cookies.set("zip", address.zip);
    Cookies.set("city", address.city);
    Cookies.set("country", address.country);
    Cookies.set("phone", address.phone);

    dispatch({ type: "[Cart] - Update shipping address", payload: address });
  };

  const createOrder = async (): Promise<{ hasError: boolean; message: string }> => {
    if (!state.shippingAddress) {
      throw new Error("There is not shipping address");
    }

    const body: IOrder = {
      orderItems: state.cart.map((p) => ({
        ...p,
        size: p.size!,
      })),
      shippingAddress: state.shippingAddress,
      numberOfItems: state.numberOfItems,
      subTotal: state.subTotal,
      tax: state.tax,
      total: state.total,
      isPaid: false,
    };

    try {
      const { data } = await tesloApi.post<IOrder>("/orders", body);
      dispatch({ type: "[Cart] - Order complete" });
      return {
        hasError: false,
        message: data._id!,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          hasError: true,
          message: (error as AxiosError<{ message: string }>).response!.data.message,
        };
      } else {
        return {
          hasError: true,
          message: "Not handled error, cominicate with the admin",
        };
      }
    }
  };

  return (
    <CartContext.Provider
      value={{
        ...state,

        //Methods
        addProductToCart,
        updateCartQuantity,
        removeCartProduct,
        updateAddress,
        createOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
