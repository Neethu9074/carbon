/* eslint-env mocha */

import {expect} from 'chai';

import clone from './clone';


describe('in-services.clone', () => {
  it('should clone arrays', () => {
    const input = [1, 'what', true, function abc() {}];
    const result = clone(input);
    expect(result).not.to.equal(input);
    expect(result).to.deep.equal(input);
  });

  it('should clone objects', () => {
    const input = {
      foo: 'bar',
      answer: '42',
      what: {
        hello() {}
      }
    };
    const result = clone(input);
    expect(result).not.to.equal(input);
    expect(result).to.deep.equal(input);
    expect(result.what).not.to.equal(input.what);
    expect(result.what).to.deep.equal(input.what);
    expect(result.what.hello).to.be.a('function');
  });
});
