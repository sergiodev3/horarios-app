import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_super_seguro';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'Token requerido.' });
  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token faltante.' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token inválido.' });
    req.user = user; // user: { id, username, role }
    next();
  });
}