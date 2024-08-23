import jwt from 'jsonwebtoken';

const secretKey = 'my_secret_key'; // Ensure this matches the secret used in authController.js

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: 'Access Denied: No Token Provided!' });
    }

    try {
        const verified = jwt.verify(token.split(' ')[1], secretKey); // Remove "Bearer " from the token string
        req.user = verified; // Attach the user object to the request
        next(); // Continue to the next middleware or route handler
    } catch (error) {
        res.status(403).json({ message: 'Invalid Token' });
    }
};

export default authenticateToken;