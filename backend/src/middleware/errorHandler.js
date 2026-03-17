export function notFoundHandler(req, res) { res.status(404).json({ error: 'Route not found.' }) }
export function errorHandler(err, req, res, next) { res.status(err.statusCode||500).json({ error: (err.statusCode||500) < 500 ? err.message : 'Internal server error.' }) }
export function asyncHandler(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next) }
