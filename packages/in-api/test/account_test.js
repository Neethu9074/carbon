/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { just } from '@instana/observables';

import { toPromise } from 'in-test/util/observables';
import { isSignedIn } from 'in-api/account';
import http from 'in-services/http';

jest.mock('in-services/http', () => ({
  __esModule: true,
  default: jest.fn()
}));

describe('in-api/account', () => {
  describe('isSignedIn', () => {
    it.each([200, 201, 202, 206])('resolves to true for http response codes in the 2xx range (%s)', status => {
      // Given
      const response = { status };
      http.mockReturnValueOnce(just(response));

      // When
      const result = isSignedIn();

      // Then
      return expect(toPromise(result)).resolves.toEqual(true);
    });

    it.each([401, 403])('resolves to false for http response code %s', status => {
      // Given
      const response = { status };
      http.mockReturnValueOnce(just(response));

      // When
      const result = isSignedIn();

      // Then
      return expect(toPromise(result)).resolves.toEqual(false);
    });

    it.each([400, 404, 500])('throws an error for other http resonse codes (%s)', status => {
      // Given
      const response = { status };
      http.mockReturnValueOnce(just(response));

      // When
      const result = isSignedIn();

      // Then
      return expect(toPromise(result)).rejects.toBeTruthy();
    });
  });
});
