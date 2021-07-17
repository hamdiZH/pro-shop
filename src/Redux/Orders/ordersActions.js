import {
    GET_ORDER_FAILED,
    GET_ORDER_START,
    GET_ORDER_SUCCESS,
    GET_ORDERS_FAILED,
    GET_ORDERS_START,
    GET_ORDERS_SUCCESS,
    PAY_ORDER_FAILED,
    PAY_ORDER_START,
    PAY_ORDER_SUCCESS,
    PLACE_ORDER_FAILED,
    PLACE_ORDER_START,
    PLACE_ORDER_SUCCESS
} from "./ordersConstantTypes";
import axios from "axios";
import {RESET_CART} from "../Cart/cartTypes";
import API_URL from "../../API";


export const placeOrder = (history) => async (dispatch, getState) => {

    console.log("enter this section ")
    dispatch({
        type: PLACE_ORDER_START
    });
    try {
        console.log("enter this section THE CATCH ")


        const state = getState();

        const requestData = {
            orderItems: state.cart.cart,
            shippingAddress: state.cart.shippingAddress,
            paymentMethod: "PayPal",
            totalPrice: state.cart.cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2),
        };

        console.log("enter this section THE response for token cart cart " ,state.cart.cart)

        const config = {
            headers: {
                "Content-Type": "Application/json",
                Authorization: `Bearer ${state.userDetails.user.token}`
            },
        };
        console.log("enter this section THE response for token  axios  1121000")

        const response = await axios.post(`${API_URL}/orders`, requestData, config);
        console.log("enter this section THE response for me " ,response)


        dispatch({
            type: PLACE_ORDER_SUCCESS,
            payload: response.data._id,
        });

        dispatch({
            type: RESET_CART,
        });

        localStorage.removeItem("cart");
        history.push(`/order/` + response.data._id);

    } catch (e) {
        dispatch({
            payload: e?.response?.data?.message,
            type: PLACE_ORDER_FAILED,
        });
    }
};

export const getOrderById = (id) => async (dispatch, getState) => {

    try{
        dispatch({
            type: GET_ORDER_START,
        });

        const state = getState();

        const config = {
            headers: {
                "Content-Type": 'application/json',
                Authorization: `Bearer ${state.userDetails.user.token}`
            },
        };

        const response = await axios.get(`${API_URL}/orders/${id}`, config);

        dispatch({
            type: GET_ORDER_SUCCESS,
            payload: response.data,
        });
    } catch (e) {
        dispatch({
            payload: e?.response?.data?.message,
            type: GET_ORDER_FAILED
        });
    }
};

export const getOrders = () => async (dispatch, getState) => {
    try {
        dispatch({
            type: GET_ORDERS_START,
        });
        const state = getState();

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${state.userDetails.user.token}`,
            },
        };

        const response = await axios.get(`${API_URL}/orders/myorders`, config);

        dispatch({
            type: GET_ORDERS_SUCCESS,
            payload: response.data,
        });
    } catch (e) {
        dispatch({
            payload: e?.response?.data?.message,
            type: GET_ORDERS_FAILED,
        });
    }
};

export const payOrder = (id, paymentResults) => async (dispatch, getState) => {
    try{
        dispatch({
            type: PAY_ORDER_START,
        });

        const state = getState();

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${state.userDetails.user.token}`,
            },
        };

        const response = await axios.put(`${API_URL}/orders/${id}/pay`, paymentResults, config);

        dispatch({
            type: PAY_ORDER_SUCCESS,
            payload: response.data,
        });

    } catch (e) {
        dispatch({
            payload: e?.response?.data?.message,
            type: PAY_ORDER_FAILED
        })
    }
};