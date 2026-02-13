import ServerManager from "../../database/managers/serverManager.js";

class Invites {
    static generateCode() {
        const code = Math.random().toString(36).substring(2, 14).padEnd(12, 'a');
        return code;
    }

    static async isValidInvite(code) {
        const server = await ServerManager.getServerByCode(code);
        return !!server;
    }

    static async createInvite() {
       let code;
       do {
           code = this.generateCode();
       } while (await this.isValidInvite(code));
       return code;
    }
}

export default Invites;