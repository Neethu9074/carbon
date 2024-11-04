/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { generateUniqueShortId } from '@instana/utils';
import { create } from '@instana/observables';

import {
  getApiTokens,
  getApiToken,
  unmaskApiToken,
  createApiToken,
  saveApiToken,
  deleteApiToken
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/ApiTokens/api';
import http from 'in-services/http';

jest.mock('in-services/http');

function mockHttp(apiData: object, isWrapped = false) {
  const mockRes = create();
  mockRes.emit(wrapWithBody(apiData, isWrapped));
  // @ts-expect-error jest api apparently not supported by TS
  http.mockReturnValue(mockRes);
}

const createToken = (internalId?: string | null, tokenName?: string | null) => ({
  name: tokenName ? tokenName : generateUniqueShortId(),
  accessGrantingToken: generateUniqueShortId(),
  internalId: internalId ? internalId : generateUniqueShortId()
});

function wrapWithBody(obj: object, isWrapped: boolean = false) {
  let resp;
  if (isWrapped) {
    //check if value is array or object and then wrap it with body
    resp = { body: Array.isArray(obj) ? [...obj] : { ...obj } };
  } else {
    resp = obj;
  }
  return resp;
}

describe('in-settings/tabs/SecurityAndAccess/pages/accessControl/ApiTokens/api', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(() => {
    // @ts-expect-error
    http.mockClear();
  });

  it('should call http function with params and return response when calling getApiToken() with params', () => {
    const apiResponse = [createToken(), createToken()];
    mockHttp(apiResponse, true);

    const getApiTokensResult$ = getApiTokens('');

    getApiTokensResult$.once(resp => {
      expect(resp).toEqual(apiResponse);
    });

    expect(http).toHaveBeenCalledWith(expect.objectContaining({ url: `/api/settings/api-tokens` }));
  });

  it('should call http function with params and return response when calling getApiToken() with params', async () => {
    const id: string = '123';
    const apiResponse = createToken(id);
    mockHttp(apiResponse, true);
    const getApiTokenResult$ = getApiToken(id);

    expect(http).toHaveBeenCalledWith(expect.objectContaining({ url: `/api/settings/api-tokens/${id}` }));
    getApiTokenResult$.once(resp => {
      expect(resp).toEqual(apiResponse);
    });
  });

  it('should call http function and return response when calling unmaskApiToken() with params', () => {
    const id: string = '456';
    const apiResponse = createToken(null, id);
    mockHttp(apiResponse);
    const unmaskApiTokenResult$ = unmaskApiToken(id);

    expect(http).toHaveBeenCalledWith(expect.objectContaining({ url: `/api/settings/api-tokens/unmask/${id}` }));
    unmaskApiTokenResult$.once(resp => {
      expect(resp).toEqual(apiResponse);
    });
  });

  it('should call http function and return response when calling createApiToken() with params', async () => {
    const apiToken = createToken();
    mockHttp(apiToken, true);
    const createApiTokenResult$ = createApiToken(apiToken);

    expect(http).toHaveBeenCalledWith(
      expect.objectContaining({ method: 'POST', url: `/api/settings/api-tokens`, data: apiToken })
    );

    createApiTokenResult$.once(resp => {
      expect(resp).toEqual(apiToken);
    });
  });

  it('should call http function and return response when calling saveApiToken() with params', async () => {
    const internalId: string = '456';
    const apiToken = createToken(internalId);
    mockHttp(apiToken, true);
    const saveApiTokenResult$ = saveApiToken(apiToken);
    expect(http).toHaveBeenCalledWith(
      expect.objectContaining({ method: 'PUT', url: `/api/settings/api-tokens/${internalId}`, data: apiToken })
    );

    saveApiTokenResult$.once(resp => {
      expect(resp).toEqual(apiToken);
    });
  });

  it('should call http function and return response when calling deleteApiToken() with params', async () => {
    const id: string = '789';
    const apiResponse = {};
    mockHttp(apiResponse);
    const deleteApiTokenResult$ = deleteApiToken(id);
    expect(http).toHaveBeenCalledWith(
      expect.objectContaining({ method: 'DELETE', url: `/api/settings/api-tokens/${encodeURIComponent(id)}` })
    );

    deleteApiTokenResult$.once(resp => {
      expect(resp).toEqual(apiResponse);
    });
  });
});
