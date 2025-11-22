const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'tu_clave_secreta';
const EXPIRES_IN = '1h'; // Puedes ajustar el tiempo de expiración

class TokenService {
    generateToken(user) {
        // Puedes incluir más datos del usuario si lo necesitas
        const payload = { userId: user.id, email: user.email, name: user.name };
        return jwt.sign(payload, SECRET_KEY, { expiresIn: EXPIRES_IN });
    }

    verifyToken(token) {
        try {
            return jwt.verify(token, SECRET_KEY);
        } catch (err) {
            return {msg: err.message}; // O lanza un error personalizado si prefieres
        }
    }
}

module.exports = new TokenService();