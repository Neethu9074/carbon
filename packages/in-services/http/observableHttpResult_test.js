/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
/* eslint-env mocha */
import { expect } from 'chai';

import { getErrors } from 'in-services/http/observableHttpResult';

describe('in-services/http/observableHttpResult', () => {
  describe('getErrors', () => {
    it('should return an empty array on missing error', () => {
      expect(getErrors()).to.deep.equal([]);
      expect(getErrors(undefined)).to.deep.equal([]);
    });

    it('should map different error messages to errors', () => {
      expect(
        getErrors({
          response: {
            status: 404,
            statusText: 'foobar'
          }
        })
      ).to.deep.equal([
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
      ).to.deep.equal([
        {
          code: 'NOT_FOUND',
          message: 'foobar'
        }
      ]);

      expect(getErrors(['foobar', 'baz', {}, false, 42])).to.deep.equal([
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
