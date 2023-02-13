export abstract class Component {

	public abstract render(): string;

	public children(): Component[] { return [] }

	public hydrate(update: () => void) {}

}
