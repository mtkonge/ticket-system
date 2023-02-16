export interface Component {
    children?(): Component[];
    render(): string;
    hydrate?(update: () => void): void;
}

function hydrateChildren(component: Component, update: () => void) {
    component.hydrate && component.hydrate(update);
    component.children &&
        component.children().forEach((child) => hydrateChildren(child, update));
}

function rerenderAndHydrate(entry: Component) {
    document.body.innerHTML = entry.render();
    requestAnimationFrame(() => {
        hydrateChildren(entry, () => rerenderAndHydrate(entry));
    });
}

export function initializeApp(entry: Component) {
    rerenderAndHydrate(entry);
}

export type ByRef<T> = { value: T };

export const byRef = <T>(value: T): ByRef<T> => ({ value });

export type Fetched<T> = { isFetched: boolean; data?: T };

export const fetched = <T>(): Fetched<T> => ({ isFetched: false });

export function domSelectId<T extends HTMLElement>(id: string): T {
    const result = document.querySelector<T>("#" + id);
    if (!result) {
        throw new Error("Could not find element from id: " + id);
    }
    return result;
}

export function domAddEvent<
    T extends HTMLElement,
    K extends keyof HTMLElementEventMap,
>(
    id: string,
    type: K,
    listener: (this: T | HTMLElement, ev: HTMLElementEventMap[K]) => any,
) {
    domSelectId<T>(id).addEventListener<K>(type, listener);
}

// export const html = (
//     literals: TemplateStringsArray,
//     ...substrings: any[]
// ): string =>
//     literals.reduce(
//         (acc, literal, i) =>
//             acc +
//             ((substring) =>
//                 Array.isArray(substring)
//                     ? (substring as any[]).map((s) => s.toString()).join("")
//                     : substring.toString())(substrings[i - 1]) +
//             literal,
//     );

export const html = (
    literals: TemplateStringsArray,
    ...substrings: any[]
): string =>
    literals.reduce(
        (acc, literal, i) =>
            acc +
            substrings[i - 1].toString() +
            literal,
    );
