export default class HttpResponseError extends Error {
  constructor(response, method, url) {
    super(`Failed to retrieve the resource: ${method} ${url}`);
    this.response = response;
  }
}
