
export type ByRef<T> = { value: T };

export const byRef = <T>(value: T): ByRef<T> => ({ value });

const randomCharPalette = "plmonkij9buvhyc2gtxfr5zde3sw1aqZX4CASDQ0WEVBN7FGHRTYM6JKLU8IOP";

export const randomChar = (chars: string = randomCharPalette): string =>
	chars.charAt(Math.floor(Math.random() * chars.length));

export const randomString = (length: number, chars: string = randomCharPalette): string =>
	length > 0 ? randomChar(chars) + randomString(length - 1, chars) : "";

export function generateId() {
	return `id_${randomString(10)}`
}

export function domSelectId<T extends HTMLElement>(id: string): T {
	const result = document.querySelector<T>("#" + id);
	if (!result) {
		throw new Error("Could not find element from id: " + id);
	}
	return result;
}

