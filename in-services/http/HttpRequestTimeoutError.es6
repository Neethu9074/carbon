import ExtendableError from 'in-services/util/ExtendableError';

export default class HttpRequestTimeoutError extends ExtendableError {
  constructor(method, url) {
    super(`Request timed out: ${method} ${url}`);
  }
}
