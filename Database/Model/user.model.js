import { hashSync } from "bcrypt";
import mongoose from "../global-setup.js";
const { Schema, model } = mongoose;

const userSchema = new Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        unique: true
    },
    userType: {
        type: String,
        required: true,
        enum:["Buyer","Admin"]
    },
    age: {
        type: Number,
        required: true,
        min:10
    },
    gender: {
        type: String,
        required: true,
        enum:["Male","Female"]
    }, phone: {
        type: String,
        required: false,
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    isMarkedAsDeleted: {
        type: Boolean,
        default: false,
    }

}, { timestamps: true });

userSchema.pre('save', function (next) {
    if (this.isModified('password')) { 
        this.password = hashSync(this.password, +process.env.SALT_NUM);
    }
    next()
})

export const User =mongoose.models.User || model('User',userSchema);