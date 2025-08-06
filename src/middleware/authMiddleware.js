/**
* Authentication middleware with express-session
* @param {Object} options - Configuration options
* @returns {Function} Express middleware
 */
export const authMiddleware = (options = {}) => {
  const config = {
    redirectTo: '/login',
    publicRoutes: ['/', '/login', '/signup', '/public', '/api-docs'],
    debug: process.env.NODE_ENV !== 'production',
    ...options
  };

  return (req, res, next) => {
    // Skip para métodos OPTIONS y HEAD
    if (['OPTIONS', 'HEAD'].includes(req.method)) {
      return next();
    }

    // Verificar rutas públicas
    const isPublic = config.publicRoutes.some(route => {
      return req.path === route || req.path.startsWith(route + '/');
    });

    if (isPublic) {
      return next();
    }

    // Verificar sesión
    if (!req.session.user) {
      if (config.debug) {
        console.log(`[Auth] Intento de acceso no autorizado a ${req.path}`);
      }

      // API request
      if (req.path.startsWith('/api')) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Debes iniciar sesión para acceder a este recurso'
        });
      }

      // Redirección para vistas
      req.session.returnTo = req.originalUrl;
      return res.redirect(config.redirectTo);
    }

    // Adjuntar usuario al request para mayor conveniencia
    req.user = req.session.user;
    next();
  };
};