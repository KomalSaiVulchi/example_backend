const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.originalUrl
  });
};

const errorHandler = (err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  console.error(err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || 'Internal Server Error'
  });
};

module.exports = {
  notFoundHandler,
  errorHandler
};
