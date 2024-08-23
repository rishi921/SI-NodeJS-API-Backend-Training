const errorHandler = (req, res, err) => {
    
    res.json({
        error: `Something Went Wrong ${err.message}`,
    });
}

export default errorHandler;