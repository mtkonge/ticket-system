
export type UserRole = "Consumer" | "LevelOne" | "LevelTwo" | "Admin";

export type Session = {
	token: string;
	userId: number;
	username: string;
	role: UserRole
};
