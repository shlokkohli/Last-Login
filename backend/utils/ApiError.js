class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong",
        errors=[],
    ){
        super(message)
        this.message = message,
        this.data = null,
        this.success = null,
        this.errors = errors,
        this.statusCode = statusCode
    }
}

export { ApiError }