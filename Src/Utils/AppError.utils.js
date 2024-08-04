export class AppEroor extends Error {
  constructor(message, statusCode, errorDetails) {
    super(message);
    this.statusCode = statusCode;
    this.errorDetails = errorDetails;
  }
}
