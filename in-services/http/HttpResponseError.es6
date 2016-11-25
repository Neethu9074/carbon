import ExtendableError from 'in-services/util/ExtendableError';

export default class HttpResponseError extends ExtendableError {
  constructor(response, method, url) {
    super(`Failed to retrieve the resource: ${method} ${url} => ${response.status}`);
    this.response = response;
  }
}
