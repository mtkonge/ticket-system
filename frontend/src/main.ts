import { Component } from "./Component";
import { Layout } from "./Layout";

function hydrateChildren(component: Component, update: () => void) {
	component.hydrate && component.hydrate(update);
	component.children && component.children().forEach(child => hydrateChildren(child, update));
}

function rerenderAndHydrate(main: Component) {
	document.body.innerHTML = main.render();
	requestAnimationFrame(() => {
		hydrateChildren(main, () => rerenderAndHydrate(main));
	});
}

const mainPage = new Layout();
rerenderAndHydrate(mainPage);

