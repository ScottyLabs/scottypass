export enum ErrorTypes {
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  MethodNotAllowed = 405,
  ImATeapot = 418,
  InternalServerError = 500,
  NotImplemented = 501,
  BadGateway = 502
}

export enum ErrorDetailTypes {
  BadRequest = "Bad Request",
  Unauthorized = "Unauthorized",
  Forbidden = "Forbidden",
  NotFound = "Resource Not Found",
  MethodNotAllowed = "Method Not Allowed",
  ImATeapot = "I'm A Teapot",
  InternalServerError = "Internal Server Error",
  NotImplemented = "Not Implemented",
  BadGateway = "Bad Gateway"
}