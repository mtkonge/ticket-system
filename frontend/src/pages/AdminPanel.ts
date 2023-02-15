import { ByRef, Component, html } from "../framework"
import { Session } from "../session";
import { generateId } from "../utils";


export class AdminPanel implements Component {
    private userSelectId = generateId();
    private userIdTextId = generateId();
    private userRoleTextId = generateId();
    private newRoleSelectId = generateId();
    private saveNewRoleButtonId = generateId();

    public constructor(
        public session: ByRef<Session | null>,
    ) { }

    public render() {
        return html`
            <h1>Admin panel</h1>
            <div>
                <h2>Update users role</h2>
                <label for="${this.userSelectId}">Select user:</label>
                <select id="${this.userSelectId}" disabled>
                    <option>loading...</option>
                </select>
                <p>User id: <code id="${this.userIdTextId}">n/a</code></p>
                <p>User role: <span id="${this.userRoleTextId}">n/a</span></p>
                <label for="${this.newRoleSelectId}">Select new role</label>
                <select id="${this.newRoleSelectId}">
                    <option>Consumer</option>
                    <option>LevelOne</option>
                    <option>LevelTwo</option>
                    <option>Admin</option>
                </select>
                <button id="${this.saveNewRoleButtonId}" disabled>Save new role</button>
            </div>
        `;
    }

    public async hydrate(update: () => void): void {

    }
}

