import PrivateDiscussion from "../models/privateDiscussionModel.js";

class PrivateDiscussionManager {

    /**
     * @async
     * @param {String} from 
     * @param {String} to 
     * @returns {PrivateDiscussion}
     */

    static async createDiscussion(from, to) {
        const discussion = new PrivateDiscussion({ users: [from, to] });
        await discussion.save();
        return discussion;
    }

    /**
     * @async
     * @param {String} from 
     * @param {String} to 
     * @returns {PrivateDiscussion}
     */

    static async getDiscussion(from, to) {
        return await PrivateDiscussion.findOne({ 
            users: { 
                $all: [from, to],
                $size: 2
            } 
        });
    }

    static async getLastMessages(userId) {
        const discussions = await PrivateDiscussion.find({
            users: userId,
            $expr: { $eq: [{ $size: "$users" }, 2] }
        }).sort({ updatedAt: -1 }).limit(10).lean();

        // For each discussion, keep only the last encryptedMessage
        return discussions.map(discussion => {
            const lastMessage = discussion.encryptedMessages.slice(-1);
            return {
                ...discussion,
                encryptedMessages: lastMessage
            };
        });
    }

    static async addMessage(discussionId, message) {
        const discussion = await PrivateDiscussion.findById(discussionId);
        if (!discussion) throw new Error("Discussion not found");

        discussion.encryptedMessages.push(message);
        await discussion.save();
        return discussion;
    }

    static async updateDiscussionStatus(from, to, status) {
        const discussion = await PrivateDiscussion.findOne({ users: { $all: [from, to] } });
        if (!discussion) throw new Error("Discussion not found");

        if (discussion.encryptedMessages[0].from !== to) {
            throw new Error("Only the recipient can update the status");
        }

        if (discussion.isWaitingForResponse !== null) {
            throw new Error("Discussion status has already been set");
        }

        if (status === 'accepted') {
            discussion.isWaitingForResponse = true;
        } else if (status === 'refused') {
            discussion.isWaitingForResponse = false;
        } else {
            throw new Error("Invalid status value");
        }

        await discussion.save();
        return discussion;
    }

}

export default PrivateDiscussionManager;
