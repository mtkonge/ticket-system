import { UserRole } from "./api";

export type Session = {
	token: string;
	userId: number;
	username: string;
	role: UserRole
};
