/* eslint-env mocha */

import { expect } from 'chai';
import sinon from 'sinon';

import HttpResponseStatusCodeError from 'in-services/http/HttpResponseStatusCodeError';

const errorMessage = 'a custom error message';

describe('in-services/http/HttpResponseStatusCodeError', () => {
  let response;
  let method;
  let url;
  let error;

  beforeEach(() => {
    response = {
      getHeader: sinon.stub(),
      body: '',
      status: 204
    };
    method = 'GET';
    url = 'https://monitoring-instana.instana.io';
  });

  it('must use embedded error messages when available for JSON content type', () => {
    response.getHeader.withArgs('Content-Type').returns('application/jsOn');
    response.body = JSON.stringify({ error: errorMessage });
    error = new HttpResponseStatusCodeError(response, method, url);
    expect(error.message).to.equal(errorMessage);
  });

  it('must use embedded error messages when available for HAL content type', () => {
    response.getHeader.withArgs('Content-Type').returns('application/hal+json');
    response.body = JSON.stringify({ error: errorMessage });
    error = new HttpResponseStatusCodeError(response, method, url);
    expect(error.message).to.equal(errorMessage);
  });

  it('must not fail when it looks like JSON, but is not actually JSON', () => {
    response.getHeader.withArgs('Content-Type').returns('application/hal+json');
    response.body = '{"foo": tue';
    error = new HttpResponseStatusCodeError(response, method, url);
    expect(error.message).to.equal('Failed to retrieve the resource: GET https://monitoring-instana.instana.io => 204');
  });
});
