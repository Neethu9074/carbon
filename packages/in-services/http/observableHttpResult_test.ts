/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env jest */

import { getErrors } from 'in-services/http/observableHttpResult';

describe('in-services/http/observableHttpResult', () => {
  describe('getErrors', () => {
    it('should return an empty array on missing error', () => {
      expect(getErrors(undefined)).toEqual([]);
    });

    it('should map different error messages to errors', () => {
      expect(
        getErrors({
          response: {
            status: 404,
            statusText: 'foobar'
          }
        })
      ).toEqual([
        {
          code: 'NOT_FOUND',
          message: 'foobar'
        }
      ]);

      expect(
        getErrors({
          response: {
            status: 404
          },
          message: 'foobar'
        })
      ).toEqual([
        {
          code: 'NOT_FOUND',
          message: 'foobar'
        }
      ]);

      expect(getErrors(['foobar', 'baz', {}, false, 42])).toEqual([
        {
          code: 'SERVER',
          message: 'foobar'
        },
        {
          code: 'SERVER',
          message: 'baz'
        }
      ]);
    });
  });
});
