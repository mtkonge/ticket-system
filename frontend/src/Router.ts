import { Customer } from "./pages/Customer";
import { Supporter } from "./pages/Supporter";
import { Component } from "./Component";

export class Router extends Component {
	private route = {value: "customer"};
	private customerPage = new Customer();
	private supporterPage = new Supporter();

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
