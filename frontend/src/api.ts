export type SessionToken = { token: string };

export type UserRole = "Consumer" | "LevelOne" | "LevelTwo" | "Admin";

export type UserInfo = {
    id: number;
    name: string;
    role: UserRole;
};

export type TicketType = "Incident" | "Request";

export type TicketStatus = "Open" | "Pending" | "Resolved";

export type TicketComment = {
    id: number,
    content: string,
    creator: number,
};

export type Ticket = {
    id: number;
    title: string;
    content: string;
    creator: number;
    assignee: number;
    urgency: TicketType;
    comments: TicketComment[];
    status: TicketStatus;
};

export type KnowledgeDocument = {
    id: number;
    title: string;
    content: string;
};

export type KnowledgeDocumentInfo = {
    id: number;
    title: string;
};

export type PostCommentRequest = {
    token: string;
    id: number;
    content: string;
};

export type PostCommentResponse = {
    ok: boolean;
    msg: string;
};

export async function postComment(
    request: PostCommentRequest,
): Promise<PostCommentResponse> {
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
    token: string;
    id: number;
    title: string;
    content: string;
};

export type EditDocumentResponse = {
    ok: boolean;
    msg: string;
};

export async function editDocument(
    request: EditDocumentRequest,
): Promise<EditDocumentResponse> {
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
    token: string;
    title: string;
    content: string;
};

export type CreateDocumentResponse = {
    ok: boolean;
    msg: string;
};

export async function createDocument(
    request: CreateDocumentRequest,
): Promise<CreateDocumentResponse> {
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

export type OneDocumentRequest = {
    token: string,
    document_id: number,
}

export type OneDocumentResponse = {
    ok: boolean;
    msg: string;
    document: KnowledgeDocument;
};

export async function oneDocument(
    request: OneDocumentRequest,
): Promise<OneDocumentResponse> {
    const response = await fetch("/api/document/one", {
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
    ok: boolean;
    msg: string;
    documents: KnowledgeDocumentInfo[];
};

export async function allDocuments(
    request: SessionToken,
): Promise<AllDocumentsResponse> {
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

export type OneTicketRequest = {
    token: string;
    id: number;
};

export type OneTicketResponse = {
    ok: boolean;
    msg: string;
    ticket: Ticket;
};

export async function oneTicket(
    request: OneTicketRequest,
): Promise<OneTicketResponse> {
    const response = await fetch("/api/ticket/one", {
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
    ok: boolean;
    msg: string;
    tickets: Ticket[];
};

export async function userCreatedTickets(
    request: SessionToken,
): Promise<UserCreatedTicketsResponse> {
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
    ok: boolean;
    msg: string;
    tickets: Ticket[];
};

export async function userAssignedTickets(
    request: SessionToken,
): Promise<UserAssignedTicketsResponse> {
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
    ok: boolean;
    users?: UserInfo[];
};

export async function allAssignableUsers(
    request: SessionToken,
): Promise<AllUsersResponse> {
    const response = await fetch("/api/user/assignable", {
        method: "POST",
        headers: new Headers({ "Content-Type": "application/json" }),
        body: JSON.stringify(request),
    });
    return {
        ...(await response.json()),
        ok: response.ok,
    };
}


export async function allUsers(
    request: SessionToken,
): Promise<AllUsersResponse> {
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
    token: string;
    title: string;
    content: string;
    urgency: TicketType;
};

export type OpenTicketResponse = {
    ok: boolean;
    msg: string;
};

export async function openTicket(
    request: OpenTicketRequest,
): Promise<OpenTicketResponse> {
    const response = await fetch("/api/ticket/open", {
        method: "POST",
        headers: new Headers({ "Content-Type": "application/json" }),
        body: JSON.stringify(request),
    });
    return {
        ...(await response.json()),
        ok: response.ok,
    };
}

export type ReassignTicketRequest = {
    token: string;
    id: number;
    assignee: number;
};

export type ReassignTicketResponse = {
    ok: boolean;
    msg: string;
};

export async function reassignTicket(
    request: ReassignTicketRequest,
): Promise<ReassignTicketResponse> {
    const response = await fetch("/api/ticket/reassign", {
        method: "POST",
        headers: new Headers({ "Content-Type": "application/json" }),
        body: JSON.stringify(request),
    });
    return {
        ...(await response.json()),
        ok: response.ok,
    };
}

export type EditTicketRequest = {
    token: string;
    id: number;
    title: string;
    urgency: TicketType;
    status: TicketStatus;
};

export type EditTicketResponse = {
    ok: boolean;
    msg: string;
};

export async function editTicket(
    request: EditTicketRequest,
): Promise<EditTicketResponse> {
    const response = await fetch("/api/ticket/edit", {
        method: "POST",
        headers: new Headers({ "Content-Type": "application/json" }),
        body: JSON.stringify(request),
    });
    return {
        ...(await response.json()),
        ok: response.ok,
    };
}

export type UserInfoResponse = {
    ok: boolean;
    msg: string;
    user_id?: number;
    username?: string;
    role?: UserRole;
};

export async function userInfo(
    request: SessionToken,
): Promise<UserInfoResponse> {
    const response = await fetch("/api/user/info", {
        method: "POST",
        headers: new Headers({ "Content-Type": "application/json" }),
        body: JSON.stringify(request),
    });
    return {
        ...(await response.json()),
        ok: response.ok,
    };
}

export type UsernamesRequest = {
    user_ids: number[];
};

export type UsernamesResponse = {
    ok: boolean;
    msg: string;
    usernames: {
        id: number;
        name: string;
    }[];
};

export async function usernames(
    request: UsernamesRequest,
): Promise<UsernamesResponse> {
    const response = await fetch("/api/user/usernames", {
        method: "POST",
        headers: new Headers({ "Content-Type": "application/json" }),
        body: JSON.stringify(request),
    });
    return {
        ...(await response.json()),
        ok: response.ok,
    };
}

export type SLAResponse = {
    ok: boolean;
    msg: string;
    document: KnowledgeDocument;
}

export async function sla(): Promise<SLAResponse> {
    const response = await fetch("/api/sla/get", {
        method: "POST",
        headers: new Headers({ "Content-Type": "application/json" }),
    });
    return {
        ...(await response.json()),
        ok: response.ok,
    };
}

export type SetSLARequest = {
    token: string;
    id: number;
};

export type SetSLAResponse = {
    ok: boolean;
    msg: string;
};

export async function setSla(request: SetSLARequest): Promise<SetSLAResponse> {
    const response = await fetch("/api/sla/set", {
        method: "POST",
        headers: new Headers({ "Content-Type": "application/json" }),
        body: JSON.stringify(request),
    });
    return {
        ...(await response.json()),
        ok: response.ok,
    };
}

export type CatalogResponse = {
    ok: boolean;
    msg: string;
    document: KnowledgeDocument;
}

export async function catalog(): Promise<CatalogResponse> {
    const response = await fetch("/api/catalog/get", {
        method: "POST",
        headers: new Headers({ "Content-Type": "application/json" }),
    });
    return {
        ...(await response.json()),
        ok: response.ok,
    };
}

export type SetCatalogRequest = {
    token: string;
    id: number;
};

export type SetCatalogResponse = {
    ok: boolean;
    msg: string;
};

export async function setCatalog(request: SetCatalogRequest): Promise<SetCatalogResponse> {
    const response = await fetch("/api/catalog/set", {
        method: "POST",
        headers: new Headers({ "Content-Type": "application/json" }),
        body: JSON.stringify(request),
    });
    return {
        ...(await response.json()),
        ok: response.ok,
    };
}

