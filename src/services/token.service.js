class TokenService {
    // Métodos relacionados con tokens (ejemplo: generación, validación)    
    generateToken(user) {
        // Lógica para generar un token JWT
        
        return 'generated-jwt-token';
    }

    verifyToken(token) {
        // Lógica para verificar un token JWT
        return { userId: 'decoded-user-id' };
    }   
}

module.exports = new TokenService();