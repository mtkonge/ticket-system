export interface Component {
	render(): string;
	children?(): Component[]
	hydrate?(update: () => void): void
}
