import messageSchema from "../schemas/messageSchema.js";

class MessageManager {

    /**
     * @param {Object} data 
     * @returns {messageSchema} 
     */

    async createMessage(data) {
        const message = new messageSchema(data);
        await message.save();
        return message;
    }

}

export default MessageManager;