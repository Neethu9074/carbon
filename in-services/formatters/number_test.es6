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

  describe('bytes', () => {
    it('should format bytes', () => {
      expect(numberFormatters.bytesZeroDecimalPlaces(1024)).to.equal('1 kB');
    });

    it('should fail on invalid numbers', () => {
      expect(() => numberFormatters.bytesZeroDecimalPlaces(null)).to.throw(Error);
      expect(() => numberFormatters.bytesZeroDecimalPlaces(NaN)).to.throw(Error);
      expect(() => numberFormatters.bytesZeroDecimalPlaces('')).to.throw(Error);
    });

    it('should format bytes with multiple decimal places', () => {
      expect(numberFormatters.bytesTwoDecimalPlaces(1089576)).to.equal('1.04 MB');
    });
  });

  describe('bytes per second', () => {
    it('should format bytes', () => {
      expect(numberFormatters.bytesPerSecondZeroDecimalPlaces(1024)).to.equal('1 kB/s');
    });

    it('should format bytes with multiple decimal places', () => {
      expect(numberFormatters.bytesPerSecondTwoDecimalPlaces(1089576)).to.equal('1.04 MB/s');
    });
  });

  describe('kilobyte', () => {
    it('should format kilobytes', () => {
      expect(numberFormatters.kiloBytesZeroDecimalPlaces(1024)).to.equal('1 MB');
    });

    it('should format bytes with multiple decimal places', () => {
      expect(numberFormatters.kiloBytesTwoDecimalPlaces(1064.039)).to.equal('1.04 MB');
    });
  });

  describe('si prefix', () => {
    it('should format various numbers', () => {
      expect(numberFormatters.withSiPrefixZeroDecimalPlaces(0.000000001567)).to.equal('2n');
      expect(numberFormatters.withSiPrefixZeroDecimalPlaces(0.000001)).to.equal('1µ');
      expect(numberFormatters.withSiPrefixZeroDecimalPlaces(0.001)).to.equal('1m');
      expect(numberFormatters.withSiPrefixZeroDecimalPlaces(1)).to.equal('1');
      expect(numberFormatters.withSiPrefixZeroDecimalPlaces(1000)).to.equal('1k');
      expect(numberFormatters.withSiPrefixZeroDecimalPlaces(1000000)).to.equal('1M');
      expect(numberFormatters.withSiPrefixZeroDecimalPlaces(1367000000)).to.equal('1G');
    });

    it('should format various numbers using only multiplication prefixes', () => {
      expect(numberFormatters.withSiMultiplyPrefixZeroDecimalPlaces(0.000000001567)).to.equal('0');
      expect(numberFormatters.withSiMultiplyPrefixZeroDecimalPlaces(0.000001)).to.equal('0');
      expect(numberFormatters.withSiMultiplyPrefixZeroDecimalPlaces(0.001)).to.equal('0');
      expect(numberFormatters.withSiMultiplyPrefixZeroDecimalPlaces(1)).to.equal('1');
      expect(numberFormatters.withSiMultiplyPrefixZeroDecimalPlaces(1000)).to.equal('1k');
      expect(numberFormatters.withSiMultiplyPrefixZeroDecimalPlaces(1000000)).to.equal('1M');
      expect(numberFormatters.withSiMultiplyPrefixZeroDecimalPlaces(1367000000)).to.equal('1G');
    });

    it('should format with decimal places', () => {
      expect(numberFormatters.withSiPrefixThreeDecimalPlaces(0.000000001567)).to.equal('1.567n');
      expect(numberFormatters.withSiPrefixThreeDecimalPlaces(0.001567)).to.equal('1.567m');
      expect(numberFormatters.withSiPrefixThreeDecimalPlaces(1.567)).to.equal('1.567');
      expect(numberFormatters.withSiPrefixThreeDecimalPlaces(1567)).to.equal('1.567k');
    });

    it('should format with decimal places using only multiplication prefixes', () => {
      expect(numberFormatters.withSiMultiplyPrefixThreeDecimalPlaces(0.000000001567)).to.equal('0.000');
      expect(numberFormatters.withSiMultiplyPrefixThreeDecimalPlaces(0.001567)).to.equal('0.002');
      expect(numberFormatters.withSiMultiplyPrefixThreeDecimalPlaces(0.1567)).to.equal('0.157');
      expect(numberFormatters.withSiMultiplyPrefixThreeDecimalPlaces(1.567)).to.equal('1.567');
      expect(numberFormatters.withSiMultiplyPrefixThreeDecimalPlaces(1567)).to.equal('1.567k');
    });

    it('should always use the same number of decimal places', () => {
      expect(numberFormatters.withSiPrefixThreeDecimalPlaces(1.5)).to.equal('1.500');
      expect(numberFormatters.withSiPrefixThreeDecimalPlaces(1.53)).to.equal('1.530');
      expect(numberFormatters.withSiPrefixThreeDecimalPlaces(1.536)).to.equal('1.536');
      expect(numberFormatters.withSiPrefixThreeDecimalPlaces(5)).to.equal('5.000');
      expect(numberFormatters.withSiPrefixThreeDecimalPlaces(433)).to.equal('433.000');
      expect(numberFormatters.withSiPrefixThreeDecimalPlaces(4433.123)).to.equal('4.433k');
      expect(numberFormatters.withSiPrefixThreeDecimalPlaces(433.123)).to.equal('433.123');
      expect(numberFormatters.withSiPrefixThreeDecimalPlaces(433.12345)).to.equal('433.123');
    });
  });

  describe('time', () => {
    it('should format times dynamically', () => {
      expect(numberFormatters.time(2356.34)).to.equal('2,356ms');
      expect(numberFormatters.time(0.03445)).to.equal('34µs');
      expect(numberFormatters.time(60345)).to.equal('60,345ms');
    });

    it('should format millis', () => {
      expect(numberFormatters.msZeroDecimalPlaces(1000.34)).to.equal('1,000ms');
    });

    it('should format micros', () => {
      expect(numberFormatters.muSecondsZeroDecimalPlaces(1000.34)).to.equal('1,000µs');
    });

    it('should format micros to millis', () => {
      expect(numberFormatters.muSecondsToMillisZeroDecimalPlaces(3000)).to.equal('3ms');
    });

    it('should format times by micro dynamically', () => {
      expect(numberFormatters.timeByMicroTwoDecimalPlaces(10)).to.equal('10µs');
      expect(numberFormatters.timeByMicroTwoDecimalPlaces(1234)).to.equal('1.23ms');
      expect(numberFormatters.timeByMicroTwoDecimalPlaces(1 * 1000 * 1000)).to.equal('1s');
      expect(numberFormatters.timeByMicroTwoDecimalPlaces(60 * 1000 * 1000)).to.equal('1min');
      expect(numberFormatters.timeByMicroTwoDecimalPlaces(60 * 60 * 1000 * 1000)).to.equal('1h');
      expect(numberFormatters.timeByMicroTwoDecimalPlaces(24 * 60 * 60 * 1000 * 1000)).to.equal('1d');
      expect(numberFormatters.timeByMicroTwoDecimalPlaces(1234 * 24 * 60 * 60 * 1000 * 1000)).to.equal('1234d');
    });
  });
});
