/* eslint-env mocha */

import {expect} from 'chai';

import * as numberFormatters from './number';

describe('in-services.formatter.number', () => {
  describe('decimal places', () => {
    it('should format to zero decimal places', () => {
      expect(numberFormatters.zeroDecimalPlaces(42.687)).to.equal('43');
      expect(numberFormatters.zeroDecimalPlaces(42.187)).to.equal('42');
      expect(numberFormatters.zeroDecimalPlaces(-42.687)).to.equal('-43');
    });

    it('should format to two decimal places', () => {
      expect(numberFormatters.twoDecimalPlaces(42.687)).to.equal('42.69');
      expect(numberFormatters.twoDecimalPlaces(42.187)).to.equal('42.19');
      expect(numberFormatters.twoDecimalPlaces(-42.685)).to.equal('-42.69');
    });
  });

  describe('percentages', () => {
    it('should format to zero decimal places', () => {
      expect(numberFormatters.percentageZeroDecimalPlaces(0.4256)).to.equal('43%');
      expect(numberFormatters.percentageZeroDecimalPlaces(0.42187)).to.equal('42%');
      expect(numberFormatters.percentageZeroDecimalPlaces(-0.42687)).to.equal('-43%');
    });

    it('should format to two decimal places', () => {
      expect(numberFormatters.percentageTwoDecimalPlaces(0.42687)).to.equal('42.69%');
      expect(numberFormatters.percentageTwoDecimalPlaces(0.42187)).to.equal('42.19%');
      expect(numberFormatters.percentageTwoDecimalPlaces(-0.42685)).to.equal('-42.69%');
    });
  });
});
