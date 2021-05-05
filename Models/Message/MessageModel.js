const UserModel = require('../User/UserModel')

function sortByCreationDate(array) {
    return array.sort((a, b) => {
        return a.createdAt - b.createdAt;
    })
}

class MessageModel {
    constructor(db) {
        this.db = db;
    }

    async writeMessage(msg) {
        try {
            return await new this.db.Message(msg).save();
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    async getAllMessagesByUser(userId) {
        try {
            return await this.db.Message.find({
                receiver: userId,
                deletedBy: {$ne: userId}
            }, {deletedBy: 0}).populate({
                path: "sender",
                select: "_id userName"
            }).populate({
                path: "receiver",
                select: "_id userName"
            }).sort({createdAt: -1})

        } catch (e) {
            throw e;
        }
    }

    async getUnreadMessagesByUser(userId) {
        try {
            return await this.db.Message.find({
                receiver: userId,
                wasRead: false,
                deletedBy: {$ne: userId}
            }, {deletedBy: 0}).populate({
                path: "sender",
                select: "_id userName"
            }).populate({
                path: "receiver",
                select: "_id userName"
            }).sort({createdAt: -1})

        } catch (e) {
            throw e;
        }
    }

    async readMessage(userId, msgId) {
        try {
            let message = await this.getMessageById(msgId);
            if (message) {
                if (message.receiver._id.toString() != userId.toString()) {
                    throw "this message was not send to you."
                } else {
                    if (!message.wasRead) {
                        await this.db.Message.updateOne({_id: msgId}, {$set: {wasRead: true}});
                    }
                    return message;
                }
            } else {
                throw "message was not found"
            }
        } catch (e) {
            throw e;
        }
    }

    async deleteMessage(userId, msgId) {
        try {
            let message = await this.getMessageById(msgId);
            if (message) {
                if (message.receiver._id.toString() == userId.toString() || message.sender._id.toString() == userId.toString()) {
                    if (message.deletedBy.includes(userId)) {
                        throw "message already was deleted by this user";
                    } else {
                        message.deletedBy.push(userId)
                        await message.save();
                        return "message was deleted successfully";
                    }
                } else {
                    throw "this message is not related to you."

                }
            }
        } catch
            (e) {
            console.log(e);
            throw e;
        }
    }

    async getMessageById(msgId) {
        console.log(msgId);
        return await this.db.Message.findOne({
            _id: msgId
        }).populate({
            path: "sender",
            select: "_id userName"
        }).populate({
            path: "receiver",
            select: "_id userName"
        })
    }
}

module.exports = (db) => {
    return new MessageModel(db);
}