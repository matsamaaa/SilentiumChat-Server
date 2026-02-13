import Server from "../models/servers/serverModel.js";
import Invites from "../../utils/generate/invite.js";

class ServerManager {

    static async createServer({ name, owner, icon, banner }) {
        try {
            const code = await Invites.createInvite();
            const server = new Server({
                name,
                owner,
                code,
                icon,
                banner
            });

            await server.save();
            return server;
        } catch (error) {
            throw error;
        }
    }

    static async getServerByCode(code) {
        try {
            const server = await Server.findOne({ code });
            return server;
        } catch (error) {
            throw error;
        }    
    }

    static async getServerByOwnerAndCode(owner, code) {
        try {
            const server = await Server.findOne({ owner, code });
            return server;
        } catch (error) {
            throw error;
        }
    }

    static async updateServerBanner(code, bannerFilename) {
        try {
            const server = await Server.findOneAndUpdate(
                { code },
                { banner: bannerFilename },
                { new: true }
            );

            return server;
        } catch (error) {
            throw error;
        }
    }

    static async updateServerIcon(code, iconFilename) {
        try {
            const server = await Server.findOneAndUpdate(
                { code },
                { icon: iconFilename },
                { new: true }
            );

            return server;
        } catch (error) {
            throw error;
        }
    }
}

export default ServerManager;