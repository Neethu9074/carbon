/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
class UnauthorizedError extends Error {
  constructor(params) {
    super(params);
  }
}

module.exports = UnauthorizedError;
