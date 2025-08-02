const { Router } = require('express');

// Modelo del usuario
const user = require('./models/users.js');

const router = Router();

router.get("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        userFind = await user.findOne({
            email: email,
            password: password
        });

        response.cookie('check', true, {
            email: email,
            maxAge: 60000,
        }, {
            httpOnly: true
        });

        if (!userFind) throw new Error('Not found user', 404);


        return userFind;

    } catch (error) {
        throw new Error('Internal server error', 500)
    }
});

router.get("/signup", async(req, res) => {
    const { name, last_name, email, password } = req.body;
    try {
        newUser = await user.save({
            name: name,
            last_name: last_name,
            email: email,
            password: password
        });

        response.cookie('check', true, {
            email: email,
            maxAge: 60000,
        }, {
            httpOnly: true
        });


        return newUser;
    } catch (error) {
        throw new Error('Internal server error', 500)
    }

});

router.get("forgot_password", (req, res) => {
    response.cookie('check', true, {
        emal: email,
        maxAge: 60000,
    });
});