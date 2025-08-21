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

}

export default PrivateDiscussionManager;
