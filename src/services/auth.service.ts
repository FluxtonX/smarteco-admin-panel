"use client";

import { apiPost } from "@/lib/api-client";

export interface User {
    id: string;
    email: string;
    name: string;
    role: string;
}

interface SendOtpResponse {
    success: boolean;
    message: string;
    data: {
        expiresIn: number;
        isNewUser: boolean;
    };
}

interface VerifyOtpResponse {
    success: boolean;
    message: string;
    data: {
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
        user: any;
    };
}

interface GenericResponse {
    success: boolean;
    message?: string;
}

export const authService = {
    /**
     * POST /api/v1/auth/otp/send
     * Triggers the backend OTP delivery logic
     */
    async sendOtp(phone: string): Promise<SendOtpResponse> {
        return apiPost<SendOtpResponse>('/auth/otp/send', { phone });
    },

    /**
     * POST /api/v1/auth/otp/verify
     * Verifies the OTP, returning JWT access token
     */
    async verifyOtp(phone: string, otp: string): Promise<VerifyOtpResponse> {
        return apiPost<VerifyOtpResponse>('/auth/otp/verify', { phone, otp });
    },

    /**
     * POST /api/v1/auth/refresh
     */
    async refreshToken(refreshToken: string): Promise<{ success: boolean; data: { accessToken: string } }> {
        return apiPost('/auth/refresh', { refreshToken });
    },

    /**
     * POST /api/v1/auth/logout
     */
    async logout(): Promise<GenericResponse> {
        const response = await apiPost<GenericResponse>('/auth/logout', {});
        // Also cleanup local storage upon successfully pinging server
        if (typeof window !== 'undefined') {
            localStorage.removeItem('smarteco_token');
        }
        return response;
    }
};
