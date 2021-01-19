/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
/* eslint-env mocha */
import { expect } from 'chai';

import { getNumberOf1024Blocks } from 'in-services/ticks/bytes';

describe('in-services/ticks/bytes', () => {
  describe('getNumberOf1024Blocks', () => {
    it('should return the number of blocks', () => {
      expect(getNumberOf1024Blocks(0)).to.equal(0);
      expect(getNumberOf1024Blocks(10)).to.equal(0);
      expect(getNumberOf1024Blocks(1023)).to.equal(0);
      expect(getNumberOf1024Blocks(1024)).to.equal(1);
      expect(getNumberOf1024Blocks(1024 * 1024)).to.equal(2);
      expect(getNumberOf1024Blocks(1024 * 1024 * 1024 * 1024 * 1024)).to.equal(5);
    });
  });
});
