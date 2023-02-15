import { allUsers, editUserRole, UserInfo } from "../api";
import { Context } from "../Context";
import { Component, domAddEvent, domSelectId, fetched, html } from "../framework"
import { UserRole } from "../session";
import { generateId } from "../utils";


export class AdminPanel implements Component {
    private userSelectId = generateId();
    private newRoleSelectId = generateId();
    private saveNewRoleButtonId = generateId();
    private errorMessage = "";

    private selectedOptionIndex = 0;
    private usersInfo = fetched<UserInfo[]>();
    private currentUserInfo: UserInfo | null = null;

    public constructor(
        private context: Context,
    ) { }

    public render() {
        return html`
            <h1>Admin panel</h1>
            <div>
                <h2>Update users role</h2>
                ${this.errorMessage !== ""
                ? html`<p class="error-text">${this.errorMessage}</p>`
                : ""}
                <label for="${this.userSelectId}">Select user:</label>
                <select id="${this.userSelectId}" ${this.usersInfo.isFetched ? "" : "disabled"}>
                    ${this.usersInfo.isFetched
                ? this.usersInfo.data!.map(({ name }) => html`<option>${name}</option>`)
                : html`<option>loading...</option>`}
                </select>
                ${this.currentUserInfo !== null ?
                html`
                    <p>User id: <code>${this.currentUserInfo!.id}</code></p>
                    <p>User role: <span>${this.currentUserInfo!.role}</span></p>
                    <label for="${this.newRoleSelectId}">Select new role</label>
                    <select id="${this.newRoleSelectId}">
                        <option>Consumer</option>
                        <option>LevelOne</option>
                        <option>LevelTwo</option>
                        <option>Admin</option>
                    </select>
                    <button id="${this.saveNewRoleButtonId}">Save new role</button>
                    `
                : ""}
            </div>
        `;
    }

    public hydrate(update: () => void): void {
        domSelectId<HTMLSelectElement>(this.userSelectId).selectedIndex = this.selectedOptionIndex;
        if (this.context.session === null) {
            this.context.router.routeTo("/login");
            return update();
        }
        const userSelectElement = domSelectId<HTMLSelectElement>(this.userSelectId);
        if (!this.usersInfo.isFetched) {
            allUsers({ token: this.context.session!.token }).then((response) => {
                this.usersInfo.isFetched = true;
                if (!response.ok) {
                    this.errorMessage = "could not fetch userinfo"
                } else {
                    this.usersInfo.data = response.users!;

                    this.currentUserInfo = this.usersInfo.data![this.selectedOptionIndex];
                }
                update();
            })
        } else {
            domAddEvent(this.userSelectId, "change", () => {
                this.selectedOptionIndex = userSelectElement.selectedIndex;
                const selectedOption = userSelectElement.options[this.selectedOptionIndex];
                this.currentUserInfo = this.usersInfo.data!.find(({ name }) => name === selectedOption.value)!;
                update();
            })
        }
        if (this.currentUserInfo !== null) {
            domAddEvent(this.saveNewRoleButtonId, "click", async () => {
                const response = await editUserRole({
                    token: this.context.session!.token,
                    user_id: this.currentUserInfo!.id,
                    role: domSelectId<HTMLSelectElement>(this.newRoleSelectId).value as UserRole,
                })
                if (!response.ok)
                    this.errorMessage = response.msg;
                this.currentUserInfo = null;
                this.usersInfo.isFetched = false;
                update();
            });
        }
    }
}

