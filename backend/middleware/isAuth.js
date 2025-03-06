const jwt = require('jsonwebtoken');

const isAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.writeHead(302, {
            Location: 'http://localhost:5173/sign-in'
        });
        return res.status(401).json({ error: 'No token provided' });
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2) {
        return res.status(401).json({ error: 'Token error' });
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).json({ error: 'Token malformatted' });
    }

    jwt.verify(token, 'thisisthemealplan', (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Token invalid' });
        }

        req.userId = decoded.id;
        return next();
    });
};

module.exports = isAuth;
