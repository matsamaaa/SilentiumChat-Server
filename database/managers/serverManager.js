import Server from "../models/serverModel.js";
import Invites from "../../utils/generate/invite.js";
import Ids from '../../utils/generate/ids.js'
class ServerManager {

    static async createServer({ name, owner, icon, banner }) {
        try {
            const code = await Invites.createInvite();
            const server = new Server({
                name,
                owner,
                code,
                icon,
                banner,
                members: [owner]
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

    static async isMemberOfServer(userId, code) {
        try {
            const server = await Server.findOne({ code, members: userId });
            return !!server;
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

    static async addMemberToServer(code, userId) {
        try {
            const server = await Server.findOneAndUpdate(
                { code },
                { $addToSet: { members: userId } }, // addToSet prevents duplicates
                { new: true }
            );
            return server;
        } catch (error) {
            throw error;
        }
    }

    static async removeMemberFromServer(code, userId) {
        try {
            const server = await Server.findOneAndUpdate(
                { code },
                { $pull: { members: userId } },
                { new: true }
            );
            return server;
        } catch (error) {
            throw error;
        }
    }

    static async getServersMember(userId) {
        try {
            const servers = await Server.find({
                $or: [
                    { owner: userId },
                    { members: userId }
                ]
            });
            return servers;
        } catch (error) {
            throw error;
        }
    }

    static async getServerIcon(code) {
        try {
            const server = await Server.findOne({ code });
            return server ? server.icon : null;
        } catch (error) {
            throw error;
        }
    }

    static async getServerBanner(code) {
        try {
            const server = await Server.findOne({ code });
            return server ? server.banner : null;
        } catch (error) {
            throw error;
        }
    }

    static async createServerChannel(code, name, description) {
        try {
            const channel = {
                id: Ids.generateLongId(),
                name,
                description
            }

            await Server.findOneAndUpdate(
                { code },
                { $addToSet: { channels: channel } },
                { new: true }
            )

            return channel
        } catch (error) {
            throw error;
        }
    }
}

export default ServerManager;