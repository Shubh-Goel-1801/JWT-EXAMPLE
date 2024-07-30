const express = require('express');
const app = express();

app.use(express.json());

app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    const send = res.send;
    res.send = function (body) {
        console.log(`Response: ${body}`);
        return send.call(this, body);
    };
    next();
});

const usersRouter = require('./routes/users');
// const userAddressesRouter = require('./routes/userAddresses');

app.use('/users', usersRouter);
// app.use('/user_addresses', userAddressesRouter);

app.listen(2000, () => {
    console.log("Server Started on port 2000");
});
