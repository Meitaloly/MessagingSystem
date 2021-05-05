const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

class GeneratorHelper {
    createToken(data) {
        let token = jwt.sign(data, process.env.AUTH_SECRET);
        return token;
    }

    async generatePassword(password) {
        let salt = bcrypt.genSaltSync(10);
        return bcrypt.hashSync(password, salt);
    }

    async isPasswordMatch(savedPassword, newPassword) {
        return bcrypt.compareSync(newPassword, savedPassword); // true
    }

    async verifyToken(authorization, secret) {
        return new Promise((resolve, reject) => {
            jwt.verify(authorization, secret,
                function (err, decoded) {
                    if (err) {
                        return reject(err);
                    } else {
                        return resolve(decoded);
                    }
                });
        })
    }
}

module.exports = () => {
    return new GeneratorHelper();
}