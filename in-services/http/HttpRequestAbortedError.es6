import ExtendableError from 'in-services/util/ExtendableError';

export default class HttpRequestAbortedError extends ExtendableError {
  constructor(method, url) {
    super(`Request aborted: ${method} ${url}`);
  }
}
