class SError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
    this.message = message;
    this.name = "SError";
  }
}

module.exports = SError;
