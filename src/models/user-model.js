const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        default: ""
    },

    email: {
        type: String,
        unique: true,
        default: ""
    },

    password: {
        type: String,
        default: ""
    },

    role: {
        type: String,
        enum: ["DRIVER", "PASSENGER"]
    },

    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },

        coordinates: {
            type: [Number],
            default: [0, 0]
        }
    },
}, {timestamps: true});


// this is a pre save middleware that runs before a document is save to the DB
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;