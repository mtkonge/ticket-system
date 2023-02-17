
const randomCharPalette = "plmonkij9buvhyc2gtxfr5zde3sw1aqZX4CASDQ0WEVBN7FGHRTYM6JKLU8IOP";

export const randomChar = (chars: string = randomCharPalette): string =>
	chars.charAt(Math.floor(Math.random() * chars.length));

export const randomString = (length: number, chars: string = randomCharPalette): string =>
	length > 0 ? randomChar(chars) + randomString(length - 1, chars) : "";

export function generateId(name: string = "id") {
	return `${name}_${randomString(10)}`
}

export const sanitizeTextForHtml = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export class Router {
	public currentRoute: string;

	public constructor() {
		const url = new URL(window.location.href);
		this.currentRoute = url.pathname;
	}

	public routeTo(route: string, query: string = "") {
		this.currentRoute = route;
		const url = new URL(window.location.href);
		url.pathname = route;
		url.search = query;
		window.history.pushState({}, "", url);
	}

	public updateRouteToUrl() {
		const url = new URL(window.location.href);
		this.currentRoute = url.pathname;
	}

	public route(): string { return this.currentRoute; }
}
