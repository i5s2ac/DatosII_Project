import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email, username: user.username },  // Incluye id, email y username en el token
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        console.error('Token verification failed:', error);
        return null;
    }
};
