class MessageManager {
    constructor() {
        this.message = {
            from: null,
            to: null,

            files: [],

            encryptedMessage: null,
            encryptedMessageBySender: null,

            publicKeyUsed: null,
            publicKeySenderUsed: null
        };
    }

    createMessage(from, to, encryptedMessage, encryptedMessageBySender, publicKeyUsed, publicKeySenderUsed) {
        this.message.from = from;
        this.message.to = to;
        this.message.encryptedMessage = encryptedMessage;
        this.message.encryptedMessageBySender = encryptedMessageBySender;
        this.message.publicKeyUsed = publicKeyUsed;
        this.message.publicKeySenderUsed = publicKeySenderUsed;

        return this.message;
    }

    addFile(fileId) {
        this.message.files.push(fileId);
        return this.message
    }

    getMessage() {
        return this.message;
    }
}

export default MessageManager;