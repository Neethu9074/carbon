/* eslint-env mocha, node */
import { expect } from 'chai';

import { resolve } from 'in-services/templateEngines/micromustache';

const scope = {
  foo: 'bar-baz-qux'
};

describe('in-services/templateEngines/micromustache', () => {
  describe('resolve', () => {
    it('should resolve template value with the takeFirst function', () => {
      expect(resolve('takeFirst(foo, 2, -)', scope)).to.equal('bar-baz');
    });

    it('should resolve template value with the truncate function', () => {
      expect(resolve('truncate(foo, 3)', scope)).to.equal('bar');
    });

    it('should resolve template value without passed function', () => {
      expect(resolve('foo', scope)).to.equal('bar-baz-qux');
    });

    it("should return undefined when template value doesn't exist", () => {
      expect(resolve('foobar', scope)).to.equal(undefined);
    });
  });
});
