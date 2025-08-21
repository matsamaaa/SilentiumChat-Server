import PrivateDiscussion from "../models/privateDiscussion";

class PrivateDiscussionManager {

    /**
     * @param {String} from 
     * @param {String} to 
     * @returns {PrivateDiscussion}
     */

    async createDiscussion(from, to) {
        const discussion = new PrivateDiscussion({ from, to });
        await discussion.save();
        return discussion;
    }

    /**
     * @param {String} from 
     * @param {String} to 
     * @returns {PrivateDiscussion}
     */

    async getDiscussion(from, to) {
        return await PrivateDiscussion.findOne({ from, to });
    }

}

export default PrivateDiscussionManager;
