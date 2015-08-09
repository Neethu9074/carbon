

export default class HttpResponseError extends Error {
  constructor(response) {
    super('Failed to retrieve the resource.');
    this.response = response;
  }
}
