export default class HttpRequestTimeoutError extends Error {
  constructor(method, url) {
    super(`Request timed out: ${method} ${url}`);
  }
}
