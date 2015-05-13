/*eslint-env mocha, node*/

'use strict';

import sinon from 'sinon';
import {expect} from 'chai';
import {getMaxValue, addMaxValueLocator} from './index';

describe('metrics', () => {

  describe('getMaxValue', () => {

    it('should throw error for unknown metrics', () => {
      expect(() => getMaxValue('gibbet nich')).to.throw(Error);
    });

    it('should match metric names based on a regular expression', () => {
      const locator = sinon.stub();
      locator.returns(42);
      const snapshot = 'aSnapshot';
      addMaxValueLocator(/^memory\.free/, locator);

      const maxValue = getMaxValue('memory.free.5000.mean', snapshot);
      expect(maxValue).to.equal(42);
      expect(locator.calledOnce).to.equal(true);
      expect(locator.getCall(0).args[0]).to.equal(snapshot);
    });

    it('should avoid similar locators that do not match exactly', () => {
      const memoryStub = sinon.stub();
      memoryStub.returns('memory');
      addMaxValueLocator(/^memory\.free/, memoryStub);

      const loadStub = sinon.stub();
      loadStub.returns('load');
      addMaxValueLocator(/^load/, loadStub);

      const maxValue = getMaxValue('load.5000.mean', 'aSnapshot');
      expect(maxValue).to.equal('load');
    });

  });

});
