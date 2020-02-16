module.exports.requireUser = (req, res, next) => {
    const token = (req.headers.authorization || "").split(' ')[1];
    if (!token) {
        return res.status(403).json({ error: 'No user found' });
    }

    req.user = Buffer.from(token, 'base64').toString('ascii');
    next();
}
