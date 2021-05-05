const express = require('express');
const bodyParser = require("body-parser");
const db = require("./Models/db")
const app = express()
const port = process.env.PORT
const jwt = require("jsonwebtoken");
const jwt_helper = require('./helpers/generatorHelper');
const response = require('./Routes/response');

app.use(express.static(__dirname + '/statics'));
app.use(bodyParser.json({
    limit: '100mb'
}));

app.listen(port, () => {
    console.log(`******************************`);
    console.log('   env:', process.env.NODE_ENV);
    console.log(`   listening on port: ${port}`);
    console.log(`******************************`);
})

function denyRequest(res) {
    return response.error(res, "NOT AUTHORIZED", 401);
}

app.use(async function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT, OPTIONS")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");

    let originalUrl = req.originalUrl.toLowerCase();

    if (req.method === 'OPTIONS' || originalUrl.includes("user/login") || originalUrl.includes("user/signup")) {
        next();
    } else {
        try {
            let authorizationDetails = await jwt_helper().verifyToken(req.headers.authorization, process.env.AUTH_SECRET)
            if (authorizationDetails && authorizationDetails.userName && authorizationDetails.userId) {
                req.userName = authorizationDetails.userName;
                req.userId = authorizationDetails.userId;
                next();
            } else {
                return denyRequest(res);
            }
        } catch (e) {
            return denyRequest(res);
        }
    }
});


app.use('/api/Message', require('./Routes/MessageRouter')(db));
app.use('/api/User', require('./Routes/UserRouter')(db));

