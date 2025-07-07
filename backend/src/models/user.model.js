import mongoose from "mongoose";

import { capitalizeFirstLetter } from '../lib/utils.js';

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePic: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    }
}, 
{ timestamps: true }
);

userSchema.pre('save', function (next) {
    if(this.name){
        this.name = capitalizeFirstLetter(this.name);
    }
    next();
});

export default mongoose.model('User', userSchema);