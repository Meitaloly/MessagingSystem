const express = require('express');
const UserRouter = express.Router();
const UserController = require('../Controllers/UserController');
const response = require('./response');

module.exports = (db) => {
    UserRouter.post('/signUp', (req, res) => {
        let details = req.body
        if (!details.userName || details.userName.length === 0) {
            return response.error(res, 'UserName was not provided', 403)
        }

        if (!details.password || details.password.length === 0) {
            return response.error(res, 'Password was not provided', 403)
        }

        UserController(db).signUp(details)
            .then(token => {
                return response.success(res, token);
            })
            .catch(e => {
                return response.error(res, e);
            })
    })

    UserRouter.post('/login', (req, res) => {
        let details = req.body
        if (!details.userName || details.userName.length === 0) {
            return response.error(res, 'UserName was not provided', 403)
        }

        if (!details.password || details.password.length === 0) {
            return response.error(res, 'Password was not provided', 403)
        }

        UserController(db).login(details)
            .then(token => {
                return response.success(res, token);
            })
            .catch(e => {
                return response.error(res, e);
            })
    })

    return UserRouter;
}