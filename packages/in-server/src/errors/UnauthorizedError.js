class UnauthorizedError extends Error {
  constructor(params) {
    super(params);
  }
}

module.exports = UnauthorizedError;
