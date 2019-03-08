/* eslint-env mocha */
import { expect } from 'chai';

import { shouldUpdate } from './UpdateOnlyWhenChanged';

describe('reload only on change', () => {
  it('should not update if both are undefined', () => {
    expect(shouldUpdate(undefined, undefined)).to.be.false;
  });

  it('should not update if both are null', () => {
    expect(shouldUpdate(null, null)).to.be.false;
  });

  it('should not update if both are null/undefined', () => {
    expect(shouldUpdate(null, undefined)).to.be.false;
  });

  it("should update previous is null and next isn't", () => {
    expect(shouldUpdate(null, [])).to.be.true;
  });

  it("should update next is undefined and previous isn't", () => {
    expect(shouldUpdate([], undefined)).to.be.true;
  });

  it('should update on arrays of different length', () => {
    expect(shouldUpdate(['a', 'b'], ['c'])).to.be.true;
  });

  it('should update on arrays with the same elements but out of order', () => {
    expect(shouldUpdate(['a', 'b', 'c'], ['a', 'c', 'b'])).to.be.true;
  });

  it('should not update on identical array contents', () => {
    expect(shouldUpdate(['a', 'b', 'c'], ['a', 'b', 'c'])).to.be.false;
  });

  it('should update on  array of same lengths with different elements', () => {
    expect(shouldUpdate(['a', 'b', 'c'], ['a', 'b', 'd'])).to.be.true;
  });
});
