/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env jest */
import { expect } from 'chai';

import { getSteps } from 'in-components/Pagination/Pagination';

describe('in-components/Pagination/Pagination', () => {
  describe('getSteps', () => {
    it('should create steps', () => {
      expect(getSteps(1, 1)).to.deep.equal([1]);

      expect(getSteps(1, 2)).to.deep.equal([1, 2]);

      expect(getSteps(2, 2)).to.deep.equal([1, 2]);

      expect(getSteps(2, 3)).to.deep.equal([1, 2, 3]);

      expect(getSteps(1, 4)).to.deep.equal([1, 2, 3, 4]);

      expect(getSteps(1, 5)).to.deep.equal([1, 2, 3, undefined, 5]);
    });
  });
});
