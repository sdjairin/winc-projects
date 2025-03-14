const NotFoundErrorHandler = (err, req, res, next) => {
  if (err.name === "NotFoundError") {
    return res.status(404).send(err.message);
  }
  next(err);
};

export default NotFoundErrorHandler;
