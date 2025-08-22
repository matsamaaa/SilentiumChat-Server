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

    static async addMessage(discussionId, message) {
        const discussion = await PrivateDiscussion.findById(discussionId);
        if (!discussion) throw new Error("Discussion not found");

        discussion.encryptedMessages.push(message);
        await discussion.save();
        return discussion;
    }

}

export default PrivateDiscussionManager;
