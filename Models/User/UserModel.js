const jwt_helper = require("../../helpers/generatorHelper")();

class UserModel {
    constructor(db) {
        this.db = db;
    }

    async createNewUser(details) {
        try {
            let obj = {
                userName: details.userName,
                password: await jwt_helper.generatePassword(details.password)
            }
            let savedUser = await new this.db.User(obj).save();
            if (savedUser) {
                return jwt_helper.createToken({userId: savedUser._id, userName: savedUser.userName});
            }
        } catch (e) {
            console.log(e);
            throw e;

        }
    }

    async login(details) {
        let token = null;
        let user = await this.db.User.findOne({userName: details.userName})
        if (user) {
            if (await jwt_helper.isPasswordMatch(user.password, details.password)) {
                token = jwt_helper.createToken({userId: user._id, userName: user.userName});
            } else {
                throw "password is incorrect. please try again."
            }
        } else {
            throw "userName is not exists. please try again."
        }
        return token;

    }

    async getByUserName(userName) {
        return await this.db.User.findOne({userName});
    }
}

module.exports = (db) => {
    return new UserModel(db);
}