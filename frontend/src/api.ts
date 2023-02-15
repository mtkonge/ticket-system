
export type SessionToken = { token: string };

export type UserRole = "Consumer" | "LevelOne" | "LevelTwo" | "Admin";

export type UserInfo = {
    id: number,
    name: string,
    role: UserRole,
}

export type TicketType = "Incident" | "Request";

export type TicketComment = {
    id: number,
    message: string,
    user_id: number,
}

export type Ticket = {
    id: number,
    title: string,
    content: string,
    creator: number,
    assignee: number,
    urguncy: TicketType,
    comments: TicketComment[]
}

export type Document = {
    id: number,
    title: string,
}

export type PostCommentRequest = {
    token: string,
    id: number,
    content: string,
}

export type PostCommentResponse = {
    ok: boolean,
    msg: string,
}

export async function postComment(request: PostCommentRequest): Promise<PostCommentResponse> {
    const response = await fetch("/api/ticket/comment", {
        method: "POST",
        headers: new Headers({ "Content-Type": "application/json" }),
        body: JSON.stringify(request),
    });
    return {
        ...(await response.json()),
        ok: response.ok,
    };
}

export type EditDocumentRequest = {
    token: string,
    id: number,
    title: string,
    content: string,
}

export type EditDocumentResponse = {
    ok: boolean,
    msg: string,
}

export async function editDocument(request: EditDocumentRequest): Promise<EditDocumentResponse> {
    const response = await fetch("/api/document/edit", {
        method: "POST",
        headers: new Headers({ "Content-Type": "application/json" }),
        body: JSON.stringify(request),
    });
    return {
        ...(await response.json()),
        ok: response.ok,
    };
}

export type CreateDocumentRequest = {
    token: string,
    title: string,
    content: string,
}

export type CreateDocumentResponse = {
    ok: boolean,
    msg: string,
}

export async function createDocument(request: CreateDocumentRequest): Promise<CreateDocumentResponse> {
    const response = await fetch("/api/document/create", {
        method: "POST",
        headers: new Headers({ "Content-Type": "application/json" }),
        body: JSON.stringify(request),
    });
    return {
        ...(await response.json()),
        ok: response.ok,
    };
}

export type AllDocumentsResponse = {
    ok: boolean,
    msg: string,
    documents: Document[],
}

export async function allDocuments(request: SessionToken): Promise<AllDocumentsResponse> {
    const response = await fetch("/api/document/all", {
        method: "POST",
        headers: new Headers({ "Content-Type": "application/json" }),
        body: JSON.stringify(request),
    });
    return {
        ...(await response.json()),
        ok: response.ok,
    };
}

export type UserCreatedTicketsResponse = {
    ok: boolean,
    msg: string,
    tickets: Ticket[]
};


export async function userCreatedTickets(request: SessionToken): Promise<UserCreatedTicketsResponse> {
    const response = await fetch("/api/user/opened", {
        method: "POST",
        headers: new Headers({ "Content-Type": "application/json" }),
        body: JSON.stringify(request),
    });
    return {
        ...(await response.json()),
        ok: response.ok,
    };
}

export type UserAssignedTicketsResponse = {
    ok: boolean,
    msg: string,
    tickets: Ticket[]
};


export async function userAssignedTickets(request: SessionToken): Promise<UserAssignedTicketsResponse> {
    const response = await fetch("/api/user/assigned", {
        method: "POST",
        headers: new Headers({ "Content-Type": "application/json" }),
        body: JSON.stringify(request),
    });
    return {
        ...(await response.json()),
        ok: response.ok,
    };
}

export type AllUsersResponse = {
    ok: boolean,
    users?: UserInfo[],
}

export async function allUsers(request: SessionToken): Promise<AllUsersResponse> {
    const response = await fetch("/api/user/all", {
        method: "POST",
        headers: new Headers({ "Content-Type": "application/json" }),
        body: JSON.stringify(request),
    });
    return {
        ...(await response.json()),
        ok: response.ok,
    };
}

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


export type OpenTicketRequest = {
    token: string,
    title: string,
    content: string,
    urgency: TicketType,
}

export type OpenTicketResponse = {
    ok: boolean,
    msg: string,
}

export async function openTicket(request: OpenTicketRequest): Promise<OpenTicketResponse> {
    const response = await fetch("/api/ticket/open", {
        method: "POST",
        headers: new Headers({ "Content-Type": "application/json" }),
        body: JSON.stringify(request),
    });
    return {
        ...await response.json(),
        ok: response.ok,
    };
}

export type ReassignTicketRequest = {
    token: string,
    id: number,
    assignee: number,
}

export type ReassignTicketResponse = {
    ok: boolean,
    msg: string,
}

export async function reassignTicket(request: EditTicketRequest): Promise<EditTicketResponse> {
    const response = await fetch("/api/ticket/reassign", {
        method: "POST",
        headers: new Headers({ "Content-Type": "application/json" }),
        body: JSON.stringify(request),
    });
    return {
        ...await response.json(),
        ok: response.ok,
    };
}

export type EditTicketRequest = {
    token: string,
    id: number,
    title: string,
    urgency: TicketType,
}

export type EditTicketResponse = {
    ok: boolean,
    msg: string,
}

export async function editTicket(request: EditTicketRequest): Promise<EditTicketResponse> {
    const response = await fetch("/api/ticket/edit", {
        method: "POST",
        headers: new Headers({ "Content-Type": "application/json" }),
        body: JSON.stringify(request),
    });
    return {
        ...await response.json(),
        ok: response.ok,
    };
}

export type UserInfoResponse = {
    ok: boolean,
    msg: string,
    user_id?: number,
    username?: string,
    role?: UserRole,
}

export async function userInfo(request: SessionToken): Promise<UserInfoResponse> {
    const response = await fetch("/api/user/info", {
        method: "POST",
        headers: new Headers({ "Content-Type": "application/json" }),
        body: JSON.stringify(request),
    });
    return {
        ...await response.json(),
        ok: response.ok,
    };

}
