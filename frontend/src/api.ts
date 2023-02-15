import { UserRole } from "./session";

export type EditUserRoleRequest = {
    token: string;
    user_id: number;
    role: UserRole;
};

export type EditUserRoleResponse = {
    ok: boolean;
    msg: string;
};

export async function editUserRole(
    request: EditUserRoleRequest,
): Promise<EditUserRoleResponse> {
    const response = await fetch("/api/user/edit_role", {
        method: "POST",
        headers: new Headers({ "Content-Type": "application/json" }),
        body: JSON.stringify(request),
    });
    return {
        ...(await response.json()),
        ok: response.ok,
    };
}

export type RegisterUserRequest = {
    username: string;
    password: string;
};

export type RegisterUserResponse = {
    ok: boolean;
    msg: string;
};

export async function registerUser(
    request: RegisterUserRequest,
): Promise<RegisterUserResponse> {
    const response = await fetch("/api/user/register", {
        method: "POST",
        headers: new Headers({ "Content-Type": "application/json" }),
        body: JSON.stringify(request),
    });
    return {
        ...(await response.json()),
        ok: response.ok,
    };
}

export type LoginRequest = {
    username: string;
    password: string;
};

export type LoginResponse = {
    ok: boolean;
    msg: string;
    token?: string;
};

export async function loginUser(request: LoginRequest): Promise<LoginResponse> {
    const response = await fetch("/api/user/login", {
        method: "POST",
        headers: new Headers({ "Content-Type": "application/json" }),
        body: JSON.stringify(request),
    });
    const data = await response.json();
    return {
        ...data,
        token: data["token"] ?? data["session"] ?? undefined,
        ok: response.ok,
    };
}

export type UserInfoRequest = {
    token: string,
}

export type UserInfoResponse = {
    ok: boolean,
    msg: string,
    user_id?: number,
    username?: string,
    role?: UserRole,
}

export async function userInfo(request: UserInfoRequest): Promise<UserInfoResponse> {
    const response = await fetch("/api/user/login", {
        method: "POST",
        headers: new Headers({ "Content-Type": "application/json" }),
        body: JSON.stringify(request),
    });
    return {
        ...await response.json(),
        ok: response.ok,
    };

}

