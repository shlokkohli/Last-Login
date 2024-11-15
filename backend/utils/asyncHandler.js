const asyncHandler = (func) => async (req, res, next) => {
    try {
        const result = await func(req, res, next);
        return result;
    } catch (error) {
        return res.status(error.code || 500).json({
            success: false,
            message: error.message
        })
    }
}

export { asyncHandler };