/* eslint-env mocha */
import {expect} from 'chai';

import classnames from './classnames';

describe('util.classnames', () => {
  it('should turn an object into a class string', () => {
    expect(classnames({foo: true, bar: false})).to.equal('foo');
  });

  it('should handle falsy values', () => {
    expect(classnames({bar: null})).to.equal('');
  });

  it('should handle truthy values', () => {
    expect(classnames({bar: 'blub'})).to.equal('bar');
  });
});
