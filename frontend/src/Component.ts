export interface Component {
	children?(): Component[]
	render(): string;
	hydrate?(update: () => void): void
}
