'use strict';

import {expect} from 'chai';
import * as converter from './index';

describe('converters', () => {
  describe('formatBytes', () => {
    it('should format bytes', () => {
      expect(converter.formatBytes(1000)).to.equal('1 kB');
    });

    it('should fail on invalid numbers', () => {
      expect(() => converter.formatBytes(null)).to.throw(Error);
      expect(() => converter.formatBytes(NaN)).to.throw(Error);
      expect(() => converter.formatBytes('')).to.throw(Error);
    });
  });
});
