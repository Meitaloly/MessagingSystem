const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let MessageSchema = new Schema({
    createdAt: {
        type: Date,
        default: Date.now
    },
    sender: {
        type: Schema.ObjectId,
        ref: "User"
    },
    receiver: {
        type: Schema.ObjectId,
        ref: "User"
    },
    subject: String,
    message: String,
    wasRead: {
        type: Boolean,
        default: false
    },
    deletedBy: [{
        type: Schema.ObjectId,
        ref: "User"
    }]
})

module.exports = mongoose.model('Message', MessageSchema);