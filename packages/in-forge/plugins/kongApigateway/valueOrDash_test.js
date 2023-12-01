/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { expect } from 'chai';

import { valueOrDash } from 'in-forge/plugins/kongApigateway/valueOrDash';

describe('Dashboard/Content/valueOrDash', () => {
  describe('valueOrDash', () => {
    it('should return - for null,undefined and blank values', () => {
      expect(valueOrDash(null)).to.equal('-');
      expect(valueOrDash(undefined)).to.equal('-');
      expect(valueOrDash('')).to.equal('-');
    });

    it('should return string values for string and numeric values', () => {
      expect(valueOrDash(1)).to.equal('1');
      expect(valueOrDash('foo')).to.equal('foo');
    });
  });
});
