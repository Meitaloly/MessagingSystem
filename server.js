const express = require('express');
const bodyParser = require("body-parser");
const db = require("./Models/db")
const app = express()
const port = process.env.PORT
const jwt = require("jsonwebtoken");

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
    return res.status(401).json("NOT AUTHORIZED");
}

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT, OPTIONS")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");

    let originalUrl = req.originalUrl.toLowerCase();
    if (req.method === 'OPTIONS' || req.originalUrl.includes("user/login") || req.originalUrl.includes("user/signup")) {
        next();
    } else {
        jwt.verify(req.headers.authorization, process.env.AUTH_SECRET,
            function (err, decoded) {
                if (err) {
                    return denyRequest(res);
                } else {
                    if (decoded && decoded.userId) {
                        req.userId = decoded.userId;
                        next();
                    }
                }
            });
    }
});


app.use('/api/Message', require('./Routes/MessageRouter')(db));
app.use('/api/User', require('./Routes/UserRouter')(db));

