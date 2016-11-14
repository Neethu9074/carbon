import ExtendableError from 'in-services/util/ExtendableError';

export default class HttpResponseError extends ExtendableError {
  constructor(response, method, url) {
    super(`Failed to retrieve the resource: ${method} ${url}`);
    this.response = response;
  }
}
