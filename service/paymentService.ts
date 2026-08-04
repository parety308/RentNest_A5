import { apiClient } from "./client";

export interface CreatePaymentPayload {
    rentalRequestId: string;
}

export interface CreatePaymentResponse {
    success: boolean;
    data: {
        checkoutUrl: string;
        transactionId: string;
    };
}

export interface VerifyPaymentPayload {
    sessionId: string;
}

export interface VerifyPaymentResponse {
    success: boolean;
    message: string;
    data: {
        payment: any;
        rentalRequest: any;
    };
}

export const paymentService = {

    createPayment: async (
        data: CreatePaymentPayload
    ) => {
        return apiClient("/payments/create", {
            method: "POST",
            body: JSON.stringify(data),
        }) as Promise<CreatePaymentResponse>;
    },


    verifyPayment: async (
        data: VerifyPaymentPayload
    ) => {
        return apiClient("/payments/verify", {
            method: "POST",
            body: JSON.stringify(data),
        }) as Promise<VerifyPaymentResponse>;
    },


    getPaymentHistory: async () => {
        return apiClient("/payments/history");
    },


    getPaymentDetails: async (
        id: string
    ) => {
        return apiClient(`/payments/${id}`);
    },

};