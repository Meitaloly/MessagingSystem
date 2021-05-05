const MessageModel = require('../Models/Message/MessageModel.js')
const UserController = require('./UserController');
const mustKeys = ["sender", "receiver", "message", "subject"];

function isMessageObjValid(msg, userName) {
    let res = {
        isOk: true,
        errMsg: null
    }
    for (let elem of mustKeys) {
        if (!msg[elem]) {
            res.isOk = false;
            res.errMsg = `${elem} was not provided!`;
            break;
        }
    }

    if (res.isOk && msg.sender != userName) {
        res.isOk = false;
        res.errMsg = `The sender must be the current logged in user!`;
    }
    return res;
}

class MessageController {
    constructor(db) {
        this.db = db;
    }

    async writeMessage(msg, user) {
        try {
            let validationObj = isMessageObjValid(msg, user.userName);
            if (validationObj.isOk) {
                let receiver = await UserController(this.db).getByUserName(msg.receiver);
                if (receiver) {
                    msg.sender = user._id;
                    msg.receiver = receiver._id;
                    let savedMsg = await MessageModel(this.db).writeMessage(msg);
                    return savedMsg;
                } else {
                    throw "the receiver user does not exists in our system."
                }
            } else {
                throw validationObj.errMsg;
            }
        } catch (e) {
            throw e;
        }
    }

    getAllMessagesByUser(userId) {
        try {
            return MessageModel(this.db).getAllMessagesByUser(userId)
        } catch (e) {
            throw e;
        }
    }

    getUnreadMessagesByUser(userId) {
        try {
            return MessageModel(this.db).getUnreadMessagesByUser(userId)
        } catch (e) {
            throw e;
        }
    }

    readMessage(userId, msgId) {
        try {
            return MessageModel(this.db).readMessage(userId,msgId)
        } catch (e) {
            throw e;
        }
    }

    deleteMessage(userId, msgId) {
        try {
            return MessageModel(this.db).deleteMessage(userId,msgId)
        } catch (e) {
            throw e;
        }
    }

}

module.exports = (db) => {
    return new MessageController(db);
};