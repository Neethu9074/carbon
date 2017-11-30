import ExtendableError from 'in-services/util/ExtendableError';

const isJsonTest = /^application\/([a-z0-9]+\+)?json$/i;

export default class HttpResponseStatusCodeError extends ExtendableError {
  constructor(response, method, url) {
    super(getMessage(response, method, url));
    this.response = response;
  }
}

function getMessage(response, method, url) {
  if (isJsonTest.test(response.getHeader('Content-Type'))) {
    const error = getEmbeddedError(response);
    if (error) {
      return error;
    }
  }

  return `Failed to retrieve the resource: ${method} ${url} => ${response.status}`;
}

function getEmbeddedError(response) {
  try {
    return JSON.parse(response.body).error;
  } catch (e) {
    return null;
  }
}
