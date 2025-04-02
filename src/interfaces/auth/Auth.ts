import { ApiResponse } from "../ApiResponse";


export interface RegisterRequest {
    fullName: string;
    email: string;
    password: string;
    roleName: string;
}


export interface LoginRequest {
    email: string;
    password: string;
}

export interface Profile {
    phone: string;
    bio: string;
    address: string;
    birthday: string;
    avatarUrl?: string;
}

export interface RegisterResponse extends ApiResponse<{ message: string }> { }
export interface LoginResponse extends ApiResponse<{ accessToken: string }> { }
export interface RefreshTokenResponse extends ApiResponse<{ accessToken: string }> { }
export interface LogoutResponse extends ApiResponse<{ message: string }> { }
export interface UserInfoResponse extends ApiResponse<{
    userId: string;
    fullName: string;
    email: string;
    role: string;
    profile: Profile;
}> { }