class CustomError extends Error {
  public code: string;
  public statusCode: number;
  constructor(message: string, code: string, statusCode: number) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
  }
}

class NotFoundError extends CustomError {
  constructor(message: string) {
    super(message, "NOT_FOUND", 404);
  }
}

class MethodNotAllowed extends CustomError {
  constructor(message: string) {
    super(message, "METHOD_NOT_ALLOWED", 405);
  }
}

class BadRequestError extends CustomError {
  constructor(message: string) {
    super(message, "BAD_REQUEST", 400);
  }
}

class ForbiddenResourceError extends CustomError {
  constructor(message: string) {
    super(message, "FORBIDDEN_RESOURCE", 403);
  }
}

export {
  NotFoundError,
  MethodNotAllowed,
  BadRequestError,
  CustomError,
  ForbiddenResourceError,
};
