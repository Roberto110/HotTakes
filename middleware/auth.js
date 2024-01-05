const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        console.log('Test:' + token); // take out when 100% working.
        const decodedToken = jwt.verify(token, 'iCNgITvc2x4i1HRsbfeI5oV7sxXNeZ24a54rDYihvz4P7ZvvGFOVwBKNh91dE5Dp');
        const userId = decodedToken.userId;
        if (req.body.userId && req.body.userId !== userId) {
            throw 'Invalid user ID';
        } else {
            next();
        }
    } catch {
        (error) => {
            res.status(401).json({
                error: error
            });
        }
    }
};