/*eslint-env mocha, node*/

'use strict';

import sinon from 'sinon';
import {expect} from 'chai';
import {
  getMaxValue,
  addMaxValueLocator,
  getMinValue,
  addMinValueLocator,
  getNormalizedValue,
  addNormalizedValueLocator,
  getFormattedValue,
  addFormattedValueLocator
  } from './index';

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

      const maxValue = getMaxValue('memory.free', snapshot);
      expect(maxValue).to.equal(42);
      expect(locator.calledOnce).to.equal(true);
      expect(locator.getCall(0).args[0]).to.equal(snapshot);
    });

    it('should use match group for metric', () => {
      const locator = sinon.stub();
      locator.returns(42);
      const snapshot = 'aSnapshot';
      addMaxValueLocator(/^fs\.([^\.]+)\.free/, locator);

      const maxValue = getMaxValue('fs./dev/xvda1.free.5000.mean', snapshot);
      expect(maxValue).to.equal(42);
      expect(locator.calledOnce).to.equal(true);
      expect(locator.getCall(0).args[0]).to.equal(snapshot);
      expect(locator.getCall(0).args[1][1]).to.equal('/dev/xvda1');
    });

    it('should avoid similar locators that do not match exactly', () => {
      const memoryStub = sinon.stub();
      memoryStub.returns('memory');
      addMaxValueLocator(/^memory\.free/, memoryStub);

      const loadStub = sinon.stub();
      loadStub.returns('load');
      addMaxValueLocator(/^load/, loadStub);

      const maxValue = getMaxValue('load', 'aSnapshot');
      expect(maxValue).to.equal('load');
    });
  });

  describe('getMinValue', () => {

    it('should throw error for unknown metrics', () => {
      expect(() => getMinValue('gibbet nich')).to.throw(Error);
    });

    it('should match metric names based on a regular expression', () => {
      const locator = sinon.stub();
      locator.returns(42);
      const snapshot = 'aSnapshot';
      addMinValueLocator(/^memory\.free/, locator);

      const minValue = getMinValue('memory.free', snapshot);
      expect(minValue).to.equal(42);
      expect(locator.calledOnce).to.equal(true);
      expect(locator.getCall(0).args[0]).to.equal(snapshot);
    });

    it('should avoid similar locators that do not match exactly', () => {
      const memoryStub = sinon.stub();
      memoryStub.returns('memory');
      addMinValueLocator(/^memory\.free/, memoryStub);

      const loadStub = sinon.stub();
      loadStub.returns('load');
      addMinValueLocator(/^load/, loadStub);

      const minValue = getMinValue('load', 'aSnapshot');
      expect(minValue).to.equal('load');
    });
  });

  describe('getNormalizedValue', () => {

    it('should throw error for unknown metrics', () => {
      expect(() => getNormalizedValue('gibbet nich')).to.throw(Error);
    });

    it('should match metric names based on a regular expression', () => {
      const locator = sinon.stub();
      locator.returns(42);
      const snapshot = 'aSnapshot';
      addNormalizedValueLocator(/^memory\.free/, locator);

      const value = getNormalizedValue('memory.free', snapshot, 0.5);
      expect(value).to.equal(42);
      expect(locator.calledOnce).to.equal(true);
      expect(locator.getCall(0).args[0]).to.equal(42);
    });

  });

  describe('getFormattedValue', () => {

    it('should throw error for unknown metrics', () => {
      expect(() => getFormattedValue('gibbet nich')).to.throw(Error);
    });

    it('should match metric names based on a regular expression', () => {
      const locator = sinon.stub();
      locator.returns(42);
      addFormattedValueLocator(/^memory\.free/, locator);

      const value = getFormattedValue('memory.free', 0.5);
      expect(value).to.equal(42);
      expect(locator.calledOnce).to.equal(true);
      expect(locator.getCall(0).args[0]).to.equal(0.5);
    });

  });

});
