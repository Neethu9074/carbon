'use strict';

export default class HttpRequestTimeoutError extends Error {
  constructor() {
    super('Request timed out');
  }
}
