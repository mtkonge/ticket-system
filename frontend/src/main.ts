function generateId() {
	return "a" + Math.random().toString().substr(2);
}

function select<T extends HTMLElement>(id: string): T {
	const result = document.querySelector<T>("#" + id);
	if (!result) {
		throw new Error("Could not find element from id: " + id);
	}
	return result;
}

abstract class Component {

	public abstract render(): string;

	public children(): Component[] { return [] }

	public hydrate(update: () => void) {}

}

class MainPage extends Component {

	private state = { value: "test" };
	private textInput = new TextInput(this.state);

	render() {
		return /*html*/`
			<h1>${this.state.value}</h1>
			${this.textInput.render()}
		`;
	}

	children() {
		return [ this.textInput ];
	}

}

class CustomerPage extends Component {
	render() {
		return "customer";
	}
}

class SupporterPage extends Component {
	render() {
		return "supporter";
	}
}

class Router extends Component {
	private route = {value: "customer"};
	private customerPage = new CustomerPage();
	private supporterPage = new SupporterPage();

	render() {
		if (this.route.value == "customer")
			return this.customerPage.render();
		else if (this.route.value == "supporter")
			return this.supporterPage.render();
		return "<img src='https://http.cat/404.jpg'>";
	}

	children() {
		return [ this.customerPage, this.supporterPage ];
	}
}

class TextInput extends Component {

	private buttonId = generateId();
	private inputId = generateId();

	constructor(private state: { value: string }) {
		super();	
	}

	render() {
		return `<input id="${this.inputId}"><button id="${this.buttonId}">hello</button>`;
	}

	hydrate(update: () => void) {
		document.getElementById(this.buttonId)!.addEventListener("click", event => {
			this.state.value = document.querySelector<HTMLInputElement>("#" + this.inputId)!.value;
			update();
		});
	}
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
const mainPage = new MainPage();
rerenderAndHydrate(mainPage);

