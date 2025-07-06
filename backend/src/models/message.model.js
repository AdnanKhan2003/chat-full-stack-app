import mongoose from "mongoose";

const Schema = mongoose.Schema;

const messageModel = new Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    content: {
        type: String,
        required: true,
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
    },
    readBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
}, 
{ timestamps: true }
);

export default mongoose.model('Message', messageModel);