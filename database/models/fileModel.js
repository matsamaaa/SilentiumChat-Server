import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
    filename: { type: String, default: null },
    contentType: { type: String, default: null },
    metadata: {
        iv: { type: String, default: null },
        authTag: { type: String, default: null },
        encryptedKey: { type: String, default: null },
        encryptedKeySender: { type: String, default: null }
    }
});

const File = mongoose.model('File', fileSchema);

export default File;