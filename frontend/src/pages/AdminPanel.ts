import { allDocuments, allUsers, editUserRole, registerUser, setCatalog, setSla, UserInfo, UserRole } from "../api";
import { Context } from "../Context";
import { Component, domAddEvent, domSelectId, fetched, html } from "../framework"
import { generateId } from "../utils";


export class AdminPanel implements Component {
    private errorMessage = ""

    private addUserFormId = generateId();

    private userSelectId = generateId();
    private newRoleSelectId = generateId();
    private saveNewRoleButtonId = generateId();
    private editSlaFormId = generateId();
    private documentSelectId = generateId();
    private setSlaButtonId = generateId();
    private setCatalogButtonId = generateId();

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
                <h2>Add user</h2>
                <form id="${this.addUserFormId}">
                    <input type="text" name="username" placeholder="Username">
                    <br>
                    <input type="password" name="password" placeholder="Password">
                    <br>
                    <input type="submit" value="Add user">
                </form>
                <h2>Update user</h2>
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
                <h2>Documents</h2>
                <select id="${this.documentSelectId}"></select>
                <br><br>
                <button id="${this.setSlaButtonId}">Set SLA</button>
                <button id="${this.setCatalogButtonId}">Set service catalog</button>
            </div>
        `;
    }

    public hydrate(update: () => void): void {
        this.errorMessage = "";
        domSelectId<HTMLSelectElement>(this.userSelectId).selectedIndex = this.selectedOptionIndex;
        if (this.context.session === null) {
            this.context.router.routeTo("/login");
            return update();
        }

        allDocuments({ token: this.context.session!.token }).then(response => {
            if (!response.ok) {
                this.errorMessage = response.msg;
                return;
            }

            response.documents.forEach(doc => {
                const option = document.createElement("option");
                option.value = doc.id.toString();
                option.innerText = `${doc.title} (#${doc.id})`;
                domSelectId(this.documentSelectId).appendChild(option);
            });
        });

        domAddEvent(this.setSlaButtonId, "click", () => {
            const documentId = domSelectId<HTMLSelectElement>(this.documentSelectId)!.value;
            if (!documentId) return;
            setSla({ token: this.context.session!.token, id: parseInt(documentId) });
        });

        domAddEvent(this.setCatalogButtonId, "click", () => {
            const documentId = domSelectId<HTMLSelectElement>(this.documentSelectId)!.value;
            if (!documentId) return;
            setCatalog({ token: this.context.session!.token, id: parseInt(documentId) });
        });

        const addUserForm = domSelectId<HTMLFormElement>(this.addUserFormId);
        addUserForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            const data = new FormData(addUserForm);
            const response = await registerUser({
                username: data.get("username")!.toString(),
                password: data.get("password")!.toString(),
            });
            if (!response.ok) {
                this.errorMessage = response.msg;
            }
            this.usersInfo.isFetched = false;
            update();
        });

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

