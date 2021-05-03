
const jwt = require('jsonwebtoken');

class JWT_Helper {
    createToken(userId) {
        let token = jwt.sign(userId, process.env.AUTH_SECRET);
        return token;
    }

    crypt(code) {
        code = jwt.sign(code, process.env.PASSWORD_SECRET);
        return code;
    }
}


module.exports = () => {
    return new JWT_Helper();
}