export const notFound = (req, res, next) => {
    const error = new Error(`${req.originalUrl} Not Found! This Path Does Not Exists!`);
    error.status = 404;
    next(error);
};

export const errorHandler = (err, req, res, next) => {
    const message = err.message || "Something Went Wrong!";
    const status = err.status || 500;
    const data = err.data || [];
    res.status(status).json({
        message,
        data,
    });
};