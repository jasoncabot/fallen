module.exports.requireUser = (req, res, next) => {
    const token = (req.headers.authorization || "").split(' ')[1] || "";
    if (token.length == 0) {
        return res.status(403).json({ error: 'No user found' });
    }

    req.user = Buffer.from(token, 'base64').toString('ascii');
    next();
}

module.exports.requireSocketUser = (socket, next) => {
    const token = socket.handshake.auth.token || "";
    if (token.length == 0) {
        return next(new Error("No user found"));
    }

    socket.user = Buffer.from(token, 'base64').toString('ascii');
    next();
}