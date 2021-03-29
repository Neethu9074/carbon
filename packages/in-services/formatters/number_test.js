/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env mocha */

import { expect } from 'chai';

import {
  bytesPerSecondTwoDecimalPlaces,
  bytesPerSecondZeroDecimalPlaces,
  bytesTwoDecimalPlaces,
  bytesZeroDecimalPlaces,
  kiloBytesTwoDecimalPlaces,
  kiloBytesZeroDecimalPlaces,
  msZeroDecimalPlaces,
  muSecondsToMillisZeroDecimalPlaces,
  muSecondsZeroDecimalPlaces,
  percentageTwoDecimalPlaces,
  percentageZeroDecimalPlaces,
  time,
  timeByMicroTwoDecimalPlaces,
  twoDecimalPlaces,
  withSiMultiplyPrefixThreeDecimalPlaces,
  withSiMultiplyPrefixZeroDecimalPlaces,
  withSiPrefixThreeDecimalPlaces,
  withSiPrefixZeroDecimalPlaces,
  withSiPrefixOneDecimalPlace,
  zeroDecimalPlaces,
  millis,
  latency,
  latencyFixed,
  meanLatency,
  meanLatencyFixed,
  meanLatencyLargeInSeconds
} from './number';
import { days, hours, minutes, seconds } from 'in-services/time';

describe('in-services.formatter.number', () => {
  describe('decimal places', () => {
    it('should format to zero decimal places', () => {
      expect(zeroDecimalPlaces(42.687)).to.equal('43');
      expect(zeroDecimalPlaces(42.187)).to.equal('42');
      expect(zeroDecimalPlaces(-42.687)).to.equal('-43');
    });

    it('should format to two decimal places', () => {
      expect(twoDecimalPlaces(42.687)).to.equal('42.69');
      expect(twoDecimalPlaces(42.187)).to.equal('42.19');
      expect(twoDecimalPlaces(-42.685)).to.equal('-42.69');
    });

    it('should handle fractions correctly', () => {
      // 1/5 * 3 is 0.6000000000000001
      expect(twoDecimalPlaces((1 / 5) * 3)).to.equal('0.60');
    });
  });

  describe('percentages', () => {
    it('should format to zero decimal places', () => {
      expect(percentageZeroDecimalPlaces(0.4256)).to.equal('43%');
      expect(percentageZeroDecimalPlaces(0.42187)).to.equal('42%');
      expect(percentageZeroDecimalPlaces(-0.42687)).to.equal('-43%');
    });

    it('should format to two decimal places', () => {
      expect(percentageTwoDecimalPlaces(0.42687)).to.equal('42.69%');
      expect(percentageTwoDecimalPlaces(0.42187)).to.equal('42.19%');
      expect(percentageTwoDecimalPlaces(-0.42685)).to.equal('-42.69%');
    });

    it('should handle fractions correctly', () => {
      // 1/5 * 3 is 0.6000000000000001
      expect(percentageTwoDecimalPlaces(((1 / 5) * 3) / 100)).to.equal('0.60%');
    });
  });

  describe('bytes', () => {
    it('should format bytes', () => {
      expect(bytesZeroDecimalPlaces(1024)).to.equal('1 kiB');
      expect(bytesZeroDecimalPlaces(1024 * 1024)).to.equal('1 MiB');
      expect(bytesZeroDecimalPlaces(1024 * 1024 * 1024)).to.equal('1 GiB');
    });

    it('should format bytes with multiple decimal places', () => {
      expect(bytesTwoDecimalPlaces(1089576)).to.equal('1.04 MiB');
    });

    it('should handle fractions correctly', () => {
      // 1/5 * 3 is 0.6000000000000001
      expect(bytesTwoDecimalPlaces((1 / 5) * 3)).to.equal('0.60 B');
    });
  });

  describe('bytes per second', () => {
    it('should format bytes', () => {
      expect(bytesPerSecondZeroDecimalPlaces(1024)).to.equal('1 kiB/s');
    });

    it('should format bytes with multiple decimal places', () => {
      expect(bytesPerSecondTwoDecimalPlaces(1089576)).to.equal('1.04 MiB/s');
    });
  });

  describe('kilobyte', () => {
    it('should format kilobytes', () => {
      expect(kiloBytesZeroDecimalPlaces(1024)).to.equal('1 MiB');
    });

    it('should format bytes with multiple decimal places', () => {
      expect(kiloBytesTwoDecimalPlaces(1064.039)).to.equal('1.04 MiB');
    });
  });

  describe('si prefix', () => {
    it('should format various numbers', () => {
      expect(withSiPrefixZeroDecimalPlaces(0.000000001567)).to.equal('2n');
      expect(withSiPrefixZeroDecimalPlaces(0.000001)).to.equal('1µ');
      expect(withSiPrefixZeroDecimalPlaces(0.001)).to.equal('1m');
      expect(withSiPrefixZeroDecimalPlaces(1)).to.equal('1');
      expect(withSiPrefixZeroDecimalPlaces(15)).to.equal('15');
      expect(withSiPrefixZeroDecimalPlaces(14.57)).to.equal('14');
      expect(withSiPrefixZeroDecimalPlaces(-14.57)).to.equal('-14');
      expect(withSiPrefixZeroDecimalPlaces(1000)).to.equal('1k');
      expect(withSiPrefixZeroDecimalPlaces(1000)).to.equal('1k');
      expect(withSiPrefixZeroDecimalPlaces(1000000)).to.equal('1M');
      expect(withSiPrefixZeroDecimalPlaces(1367000000)).to.equal('1G');
    });

    it('should format various numbers using only multiplication prefixes', () => {
      expect(withSiMultiplyPrefixZeroDecimalPlaces(0.000000001567)).to.equal('0');
      expect(withSiMultiplyPrefixZeroDecimalPlaces(0.000001)).to.equal('0');
      expect(withSiMultiplyPrefixZeroDecimalPlaces(0.001)).to.equal('0');
      expect(withSiMultiplyPrefixZeroDecimalPlaces(1)).to.equal('1');
      expect(withSiMultiplyPrefixZeroDecimalPlaces(1000)).to.equal('1k');
      expect(withSiMultiplyPrefixZeroDecimalPlaces(1000000)).to.equal('1M');
      expect(withSiMultiplyPrefixZeroDecimalPlaces(1367000000)).to.equal('1G');
    });

    it('should format with three decimal places', () => {
      expect(withSiPrefixThreeDecimalPlaces(0.000000001567)).to.equal('1.567n');
      expect(withSiPrefixThreeDecimalPlaces(0.001567)).to.equal('1.567m');
      expect(withSiPrefixThreeDecimalPlaces(1.567)).to.equal('1.567');
      expect(withSiPrefixThreeDecimalPlaces(1567)).to.equal('1.567k');
    });

    it('should format with one decimal place', () => {
      expect(withSiPrefixOneDecimalPlace(1.567)).to.equal('1.567');
      expect(withSiPrefixOneDecimalPlace(1567)).to.equal('1.5k');
    });

    it('should format with decimal places using only multiplication prefixes', () => {
      expect(withSiMultiplyPrefixThreeDecimalPlaces(0.000000001567)).to.equal('0.000');
      expect(withSiMultiplyPrefixThreeDecimalPlaces(0.001567)).to.equal('0.002');
      expect(withSiMultiplyPrefixThreeDecimalPlaces(0.1567)).to.equal('0.157');
      expect(withSiMultiplyPrefixThreeDecimalPlaces(1.567)).to.equal('1.567');
      expect(withSiMultiplyPrefixThreeDecimalPlaces(1567)).to.equal('1.567k');
    });

    it('should always use the same number of decimal places', () => {
      expect(withSiPrefixThreeDecimalPlaces(1.5)).to.equal('1.500');
      expect(withSiPrefixThreeDecimalPlaces(1.53)).to.equal('1.530');
      expect(withSiPrefixThreeDecimalPlaces(1.536)).to.equal('1.536');
      expect(withSiPrefixThreeDecimalPlaces(5)).to.equal('5.000');
      expect(withSiPrefixThreeDecimalPlaces(433)).to.equal('433.000');
      expect(withSiPrefixThreeDecimalPlaces(4433.123)).to.equal('4.433k');
      expect(withSiPrefixThreeDecimalPlaces(433.123)).to.equal('433.123');
      expect(withSiPrefixThreeDecimalPlaces(433.12345)).to.equal('433.123');
    });

    it('should always use one decimal place', () => {
      expect(withSiPrefixOneDecimalPlace(1.5)).to.equal('1.5');
      expect(withSiPrefixOneDecimalPlace(1.53)).to.equal('1.53');
      expect(withSiPrefixOneDecimalPlace(5)).to.equal('5');
      expect(withSiPrefixOneDecimalPlace(433)).to.equal('433');
      expect(withSiPrefixOneDecimalPlace(4433.123)).to.equal('4.4k');
      expect(withSiPrefixOneDecimalPlace(433.123)).to.equal('433.123');
    });

    it('should handle fractions correctly', () => {
      // 1/5 * 3 is 0.6000000000000001
      expect(withSiMultiplyPrefixThreeDecimalPlaces((1 / 5) * 3)).to.equal('0.600');
    });

    it('should support negative values with three decimal places', () => {
      expect(withSiPrefixThreeDecimalPlaces(-1.5)).to.equal('-1.500');
      expect(withSiPrefixThreeDecimalPlaces(-1.53)).to.equal('-1.530');
      expect(withSiPrefixThreeDecimalPlaces(-1.536)).to.equal('-1.536');
      expect(withSiPrefixThreeDecimalPlaces(-5)).to.equal('-5.000');
      expect(withSiPrefixThreeDecimalPlaces(-433)).to.equal('-433.000');
      expect(withSiPrefixThreeDecimalPlaces(-4433.123)).to.equal('-4.433k');
      expect(withSiPrefixThreeDecimalPlaces(-433.123)).to.equal('-433.123');
      expect(withSiPrefixThreeDecimalPlaces(-433.12345)).to.equal('-433.123');
    });

    it('should support negative values with one decimal place', () => {
      expect(withSiPrefixOneDecimalPlace(-1.5)).to.equal('-1.5');
      expect(withSiPrefixOneDecimalPlace(-1.53)).to.equal('-1.53');
      expect(withSiPrefixOneDecimalPlace(-5)).to.equal('-5');
      expect(withSiPrefixOneDecimalPlace(-433)).to.equal('-433');
      expect(withSiPrefixOneDecimalPlace(-4433.123)).to.equal('-4.4k');
      expect(withSiPrefixOneDecimalPlace(-433.123)).to.equal('-433.123');
    });
  });

  describe('time', () => {
    it('should format times dynamically', () => {
      expect(time(2356.34)).to.equal('2,356ms');
      expect(time(0.03445)).to.equal('34µs');
      expect(time(60345)).to.equal('60,345ms');
    });

    it('should format millis', () => {
      expect(msZeroDecimalPlaces(1000.34)).to.equal('1,000ms');
    });

    it('should format micros', () => {
      expect(muSecondsZeroDecimalPlaces(1000.34)).to.equal('1,000µs');
    });

    it('should format micros to millis', () => {
      expect(muSecondsToMillisZeroDecimalPlaces(3000)).to.equal('3ms');
    });

    it('should format times by micro dynamically', () => {
      expect(timeByMicroTwoDecimalPlaces(10)).to.equal('10.00µs');
      expect(timeByMicroTwoDecimalPlaces(1234)).to.equal('1.23ms');
      expect(timeByMicroTwoDecimalPlaces(seconds.toMillis(1) * 1000)).to.equal('1.00s');
      expect(timeByMicroTwoDecimalPlaces(minutes.toMillis(1) * 1000)).to.equal('1.00min');
      expect(timeByMicroTwoDecimalPlaces(hours.toMillis(1) * 1000)).to.equal('1.00h');
      expect(timeByMicroTwoDecimalPlaces(days.toMillis(1) * 1000)).to.equal('1.00d');
      expect(timeByMicroTwoDecimalPlaces(days.toMillis(1234) * 1000)).to.equal('1,234.00d');
    });
  });

  it('must not fail on null', () => {
    expect(zeroDecimalPlaces(null)).to.equal('0');
    expect(twoDecimalPlaces(null)).to.equal('0.00');
    expect(bytesPerSecondTwoDecimalPlaces(null)).to.equal('0.00 B/s');
    expect(bytesPerSecondZeroDecimalPlaces(null)).to.equal('0 B/s');
    expect(bytesTwoDecimalPlaces(null)).to.equal('0.00 B');
    expect(bytesZeroDecimalPlaces(null)).to.equal('0 B');
    expect(kiloBytesTwoDecimalPlaces(null)).to.equal('0.00 B');
    expect(kiloBytesZeroDecimalPlaces(null)).to.equal('0 B');
    expect(msZeroDecimalPlaces(null)).to.equal('0ms');
    expect(muSecondsToMillisZeroDecimalPlaces(null)).to.equal('0ms');
    expect(muSecondsZeroDecimalPlaces(null)).to.equal('0µs');
    expect(percentageTwoDecimalPlaces(null)).to.equal('0.00%');
    expect(percentageZeroDecimalPlaces(null)).to.equal('0%');
    expect(time(null)).to.equal('0µs');
    expect(timeByMicroTwoDecimalPlaces(null)).to.equal('0µs');
    expect(withSiMultiplyPrefixThreeDecimalPlaces(null)).to.equal('0.000');
    expect(withSiMultiplyPrefixZeroDecimalPlaces(null)).to.equal('0');
    expect(withSiPrefixThreeDecimalPlaces(null)).to.equal('0.000');
    expect(withSiPrefixZeroDecimalPlaces(null)).to.equal('0');
  });

  describe('millis', () => {
    it('should format millis dynamically', () => {
      expect(millis.compact(1)).to.equal('1ms');
      expect(millis.detailed(1)).to.equal('1.00ms');
      expect(millis.compact(1200)).to.equal('1s');
      expect(millis.detailed(1200)).to.equal('1.20s');
      expect(millis.compact(75000)).to.equal('1min');
      expect(millis.detailed(75000)).to.equal('1.25min');
    });

    it('should force compact for ms', () => {
      expect(millis.forcedCompactOnMs.compact(1)).to.equal('1ms');
      expect(millis.forcedCompactOnMs.detailed(1)).to.equal('1ms');
      expect(millis.forcedCompactOnMs.compact(1200)).to.equal('1s');
      expect(millis.forcedCompactOnMs.detailed(1200)).to.equal('1.20s');
    });
  });

  describe('latency', () => {
    it('should format latency', () => {
      expect(latency.compact(0)).to.equal('< 1ms');
      expect(latency.detailed(1)).to.equal('1ms');
      expect(latency.detailed(10.5)).to.equal('11ms');
      expect(latency.detailed(1200.2)).to.equal('1.20s');
    });

    it('should format latency fixed', () => {
      expect(latencyFixed.compact(0)).to.equal('< 1ms');
      expect(latencyFixed.detailed(1)).to.equal('1ms');
      expect(latencyFixed.detailed(10.5)).to.equal('11ms');
      expect(latencyFixed.detailed(1200.2)).to.equal('1,200ms');
    });

    it('should format mean latency', () => {
      expect(meanLatency.compact(0)).to.equal('0ms');
      expect(meanLatency.compact(0.25)).to.equal('< 1ms');
      expect(meanLatency.detailed(1)).to.equal('1ms');
      expect(meanLatency.detailed(10.5)).to.equal('11ms');
      expect(meanLatency.detailed(1200.2)).to.equal('1.20s');
    });

    it('should format mean latency fixed', () => {
      expect(meanLatencyFixed.compact(0)).to.equal('0ms');
      expect(meanLatencyFixed.compact(0.25)).to.equal('< 1ms');
      expect(meanLatencyFixed.detailed(1)).to.equal('1ms');
      expect(meanLatencyFixed.detailed(10.5)).to.equal('11ms');
      expect(meanLatencyFixed.detailed(1200.2)).to.equal('1,200ms');
    });

    it('should format mean latency in seconds for large numbers', () => {
      expect(meanLatencyLargeInSeconds.compact(0)).to.equal('0ms');
      expect(meanLatencyLargeInSeconds.compact(0.25)).to.equal('< 1ms');
      expect(meanLatencyLargeInSeconds.compact(999999)).to.equal('999,999ms');
      expect(meanLatencyLargeInSeconds.compact(1000000)).to.equal('1,000s');
      expect(meanLatencyLargeInSeconds.detailed(1)).to.equal('1ms');
      expect(meanLatencyLargeInSeconds.detailed(10.5)).to.equal('11ms');
      expect(meanLatencyLargeInSeconds.detailed(1200.2)).to.equal('1,200ms');
      expect(meanLatencyLargeInSeconds.detailed(999999)).to.equal('999,999ms');
      expect(meanLatencyLargeInSeconds.detailed(1000000)).to.equal('1,000.00s');
    });
  });
});
