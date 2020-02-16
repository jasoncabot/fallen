const loaders = require('./loaders');
const express = require('express');
const api = require('./api');

const port = process.env.PORT;

const initialise = async () => {

    const app = express();

    const middleware = await loaders(app);
    console.log(`Loading complete [${Object.keys(middleware)}]`);

    await api.inject(middleware);

    app.listen(port, err => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(`Listening for connections on port ${port}`);
    });
}

initialise()
    .then(() => {
        console.log(`Application initialised`);
    })
    .catch((e) => {
        console.error(`Failed to initialise`);
        console.error(e);
    });
