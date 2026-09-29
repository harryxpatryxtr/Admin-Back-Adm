const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'scrt';
const EXPIRES_IN = '1h'; 

class TokenService {
    generateToken(user) {
        const role = user.role && user.role.name ? user.role : null;
        const payload = {
            userId: user.id,
            email: user.email,
            name: user.fullName || user.username,
            role: role ? role.name : null,
            roleId: role ? String(role._id) : (user.role ? String(user.role) : null),
        };
        return jwt.sign(payload, SECRET_KEY, { expiresIn: EXPIRES_IN });
    }

    verifyToken(token) {
        try {
            return jwt.verify(token, SECRET_KEY);
        } catch (err) {
            throw new Error(err); // O lanza un error personalizado si prefieres
        }
    }
}

module.exports = new TokenService();