import mongoose from "mongoose";

const Schema = mongoose.Schema;

const chatSchema = new Schema({
    chatName: {
        type: String,
        required: true,
    },
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
    },
    isGroupChat: {
        type: Boolean,
        required: true,
    },
    groupAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
}, 
{ timestamps: true }
);

export default mongoose.model('Chat', chatSchema)