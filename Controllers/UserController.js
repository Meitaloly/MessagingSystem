const UserModel = require('../Models/User/UserModel.js')

class UserController {
    constructor(db) {
        this.db = db;
    }

    async signUp(details) {
        try {
            let userExists = await UserModel(this.db).getByUserName(details.userName);
            if (userExists) {
                throw "userName is already exists. Try other userName."
            } else {
                return await UserModel(this.db).createNewUser(details);
            }
        } catch (e) {
            throw e;
        }
    }

    async login(details) {
        try {
            return await UserModel(this.db).login(details);
        } catch (e) {
            throw e;
        }
    }

    async getByUserName(userName) {
        try {
            return await UserModel(this.db).getByUserName(userName);
        } catch (e) {
            throw e;
        }
    }
}

module.exports = (db) => {
    return new UserController(db);
};