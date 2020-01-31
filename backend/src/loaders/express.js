const cors = require('cors');
const bodyParser = require('body-parser');

const whitelist = ['http://localhost:8080', 'https://fallenhaven.jasoncabot.me'];
const options = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}

module.exports = async (app) => {
    app.use(cors(options));
    app.use(bodyParser.json());

    app.get('/status', (req, res) => { res.status(200).end(); });
    app.head('/status', (req, res) => { res.status(200).end(); });
    return app;
}