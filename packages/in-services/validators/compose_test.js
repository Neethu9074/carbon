/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env jest, node */
import { expect } from 'chai';

import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { notBlankValidator } from 'in-services/validators/string';
import { stringValidator } from 'in-services/validators/jsonType';

describe('in-services/valiudators/compose', () => {
  describe('composeAndShortCircuitOnError', () => {
    let validator;

    beforeEach(() => {
      validator = composeAndShortCircuitOnError(stringValidator, notBlankValidator);
    });

    it('must short circuit on error', () => {
      expect(validator(null)).to.deep.equal([
        {
          severity: 'error',
          message: `A value of type 'String' is required. Got 'null'.`
        }
      ]);
    });

    it('must short circuit on error', () => {
      expect(validator('')).to.deep.equal([
        {
          severity: 'error',
          message: `The value must not be blank.`
        }
      ]);
    });

    it('must short circuit on error', () => {
      expect(validator('valid')).to.deep.equal([]);
    });
  });
});
