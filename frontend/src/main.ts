import { Index } from "./pages/Index";
import { Component } from "./Component";
import { TextInput } from "./TextInput";
import { Router } from "./Router";

function select<T extends HTMLElement>(id: string): T {
	const result = document.querySelector<T>("#" + id);
	if (!result) {
		throw new Error("Could not find element from id: " + id);
	}
	return result;
}


function hydrateChildren(component: Component, update: () => void) {
	component.hydrate(update);
	component.children().forEach(child => hydrateChildren(child, update));
}

function rerenderAndHydrate(main: Component) {
	document.body.innerHTML = main.render();
	requestAnimationFrame(() => {
		hydrateChildren(main, () => rerenderAndHydrate(main));
	});
}
const mainPage = new Index();
rerenderAndHydrate(mainPage);

