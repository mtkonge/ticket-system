
export type RegisterUserRequest = {
	username: string,
	password: string,
}

export type RegisterUserResponse = {
	ok: boolean,
	msg: string,
}

export async function registerUser(request: RegisterUserRequest): Promise<RegisterUserRequest> {
	const response = await fetch("/api/user/register", {
		method: "POST",
		headers: new Headers({ "Content-Type": "application/json" }),
		body: JSON.stringify(request),
	});
	return {
		...await response.json(),
		ok: response.ok,
	};
}

