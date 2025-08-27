import File from "../models/fileModel.js";

class FileManager {
    static async createFile() {
        const file = new File();
        await file.save();
        return file;    
    }

    static async addDataToFile(_id, contentType, iv, authTag, encryptedKey, encryptedKeySender) {
        const file = await File.findById(_id);
        if (!file) {
            throw new Error("File not found");
        }

        file.filename = _id.toString();
        file.contentType = contentType;
        file.metadata = {
            iv,
            authTag,
            encryptedKey,
            encryptedKeySender
        };

        await file.save();
        return file;
    }

    static async getFileById(fileId) {
        return await File.findById(fileId);
    }
}

export default FileManager;