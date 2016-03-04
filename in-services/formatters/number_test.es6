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
      expect(numberFormatters.withSiPrefixTwoDecimalPlaces(0.000000001567)).to.equal('1.57n');
      expect(numberFormatters.withSiPrefixTwoDecimalPlaces(0.001567)).to.equal('1.57m');
      expect(numberFormatters.withSiPrefixTwoDecimalPlaces(1.567)).to.equal('1.57');
      expect(numberFormatters.withSiPrefixTwoDecimalPlaces(1567)).to.equal('1.57k');
    });

    it('should format with decimal places using only multiplication prefixes', () => {
      expect(numberFormatters.withSiMultiplyPrefixTwoDecimalPlaces(0.000000001567)).to.equal('0');
      expect(numberFormatters.withSiMultiplyPrefixTwoDecimalPlaces(0.001567)).to.equal('0');
      expect(numberFormatters.withSiMultiplyPrefixTwoDecimalPlaces(1.567)).to.equal('1.57');
      expect(numberFormatters.withSiMultiplyPrefixTwoDecimalPlaces(1567)).to.equal('1.57k');
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
