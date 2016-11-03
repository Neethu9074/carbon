/* eslint-env mocha */
import {expect} from 'chai';

import {joinClassNames} from 'in-services/util/classnames';
import classnames from 'in-services/util/classnames';

describe('util.classnames', () => {
  describe('joinClassNames', () => {
    it('must not fail when no class names are passed', () => {
      expect(joinClassNames()).to.equal('');
    });

    it('must not fail no valid class name is passed', () => {
      expect(joinClassNames(null, undefined)).to.equal('');
    });

    it('must support partial class names', () => {
      expect(joinClassNames('a', null, 'c')).to.equal(' a c');
    });
  });

  describe('default export', () => {
    it('must turn an object into a class string', () => {
      expect(classnames({foo: true, bar: false})).to.equal('foo');
    });

    it('must handle falsy values', () => {
      expect(classnames({bar: null})).to.equal('');
    });

    it('must handle truthy values', () => {
      expect(classnames({bar: 'blub'})).to.equal('bar');
    });
  });
});
