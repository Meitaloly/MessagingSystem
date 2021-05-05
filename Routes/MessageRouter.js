const express = require('express');
const MessageRouter = express.Router();
const MessageController = require('../Controllers/MessageController');
const response = require('./response');

module.exports = (db) => {

    MessageRouter.post('/write', (req, res) => {
        let msg = req.body

        MessageController(db).writeMessage(msg, {_id: req.userId, userName: req.userName})
            .then(data => {
                return response.success(res, data);
            })
            .catch(e => {
                return response.error(res, e);
            })
    })

    MessageRouter.get('/all', (req, res) => {
        MessageController(db).getAllMessagesByUser(req.userId)
            .then(data => {
                return response.success(res, data);
            })
            .catch(e => {
                console.log(e);
                return response.error(res, e);
            })
    })

    MessageRouter.get('/unread', (req, res) => {
        MessageController(db).getUnreadMessagesByUser(req.userId)
            .then(data => {
                return response.success(res, data);
            })
            .catch(e => {
                return response.error(res, e);
            })
    })

    MessageRouter.put('/read/:msgId', (req, res) => {
        let msgId = req.params.msgId ? req.params.msgId : null
        if (!msgId) {
            return response.error(res, "MessageId was not provided!");
        }
        MessageController(db).readMessage(req.userId, msgId)
            .then(data => {
                return response.success(res, data);
            })
            .catch(e => {
                return response.error(res, e);
            })
    })
    MessageRouter.delete('/:msgId', (req, res) => {
        let msgId = req.params.msgId ? req.params.msgId : null
        if (!msgId) {
            return response.error(res, "MessageId was not provided!");
        }
        MessageController(db).deleteMessage(req.userId, msgId)
            .then(data => {
                return response.success(res, data);
            })
            .catch(e => {
                return response.error(res, e);
            })
    })

    return MessageRouter;
}