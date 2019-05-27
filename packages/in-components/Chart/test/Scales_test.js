/* eslint-env mocha */
import proxyquire from 'proxyquire';
import { expect } from 'chai';

import { calculateAxisMinMax } from 'in-components/Chart/Scales';
import { number } from 'in-services/formatters/number';

describe('in-components/Chart/Scales', () => {
  let Scales;
  const tickMock = [1, 2, 3];

  beforeEach(() => {
    Scales = proxyquire('in-components/Chart/Scales', {
      'in-charts/ticks/timeAxis': {
        getAxisTickPositions: () => tickMock
      }
    }).default;
  });

  describe('constuctor', () => {
    it('should only create scale for y2 if y2 axis is defined', () => {
      let scales = new Scales({});
      expect(scales.y1).not.to.be.undefined;
      expect(scales.y2).to.be.undefined;

      scales = new Scales({ y2: {} });
      expect(scales.y1).not.to.be.undefined;
      expect(scales.y2).not.to.be.undefined;
    });
  });

  describe('update', () => {
    it('should update axis according to the given config', () => {
      const scales = new Scales({
        animationDuration: 0,
        y1: { formatter: [number] },
        y2: { labels: ['a'], metrics: [[[0, 1], [1000, 20]]], formatter: [number] },
        timeConfig: { windowSize: 20000, to: 60000 },
        backBufferWidth: 100,
        height: 50,
        timeAxisHeight: 0
      });
      scales.update();

      expect(scales.xBackBuffer.getRangeFrom()).to.equal(0);
      expect(scales.xBackBuffer.getRangeTo()).to.equal(100);

      expect(scales.y1.getRangeFrom()).to.equal(50);
      expect(scales.y1.getRangeTo()).to.equal(0);

      expect(scales.y2.getRangeFrom()).to.equal(50);
      expect(scales.y2.getRangeTo()).to.equal(0);
    });

    it('should take all metric series into account when calculating metrics', () => {
      const scales = new Scales({
        y1: {
          labels: ['a', 'b'],
          metrics: [
            [[0, 1], [1000, 20]], // series 1
            [[0, -1], [1000, 0]] // series 2
          ],
          formatter: [number]
        },
        y2: {
          labels: ['a', 'b'],
          metrics: [
            [[0, 1], [1000, 20]], // series 1
            [[0, 4], [1000, 10]] // series 2
          ],
          formatter: [number]
        },
        animationDuration: 0,
        timeConfig: { windowSize: 20000, to: 60000 },
        backBufferWidth: 100,
        height: 50,
        timeAxisHeight: 0
      });
      scales.update();

      expect(scales.y1.getDomainFrom()).to.equal(0);
      expect(scales.y1.getDomainTo()).to.equal(20);

      expect(scales.y2.getDomainFrom()).to.equal(0);
      expect(scales.y2.getDomainTo()).to.equal(20);
    });

    it('should update tick positions on update', () => {
      const scales = new Scales({
        y1: { formatter: [number] },
        animationDuration: 0,
        timeConfig: { windowSize: 20000, to: 60000 },
        backBufferWidth: 100,
        height: 50,
        timeAxisHeight: 0
      });

      expect(scales.y1.tickPositions).to.be.undefined;
      scales.update();
      expect(scales.y1.tickPositions).not.to.be.undefined;
      expect(scales.y1.tickPositions).to.deep.equal(tickMock);
    });
  });

  describe('calculateAxisMinMax', () => {
    it('should set allIgnoredFlag if all metrics are filtered', () => {
      const axis = {
        labels: ['Metric1', 'Metric2']
      };
      calculateAxisMinMax(axis, new Map([['Metric1', true], ['Metric2', true]]));
      expect(axis.allDataSeriesIgnored).to.equal(true);
    });

    it('should use the axis max value if defined', () => {
      const axis = {
        metrics: [[[0, 0], [10, 1000]]],
        labels: ['Metric1'],
        max: 42
      };
      calculateAxisMinMax(axis, new Map());
      expect(axis.maxValue).to.equal(42);
    });

    it('should use 0 as min and 1 as max for empty axis', () => {
      const axis = {
        metrics: [[], []],
        labels: ['M1', 'M2']
      };
      calculateAxisMinMax(axis, new Map());
      expect(axis.minValue).to.equal(0);
      expect(axis.maxValue).to.equal(1);
    });

    it('should use 0 as min and 1 as max for max = 0', () => {
      const axis = {
        metrics: [[[0, 0]], [[0, 0]]],
        labels: ['M1', 'M2']
      };
      calculateAxisMinMax(axis, new Map());
      expect(axis.minValue).to.equal(0);
      expect(axis.maxValue).to.equal(1);
    });

    it('should find the max values on all series', () => {
      const axis = {
        metrics: [[[0, 1], [0, 10], [0, 9], [0, 3]], [[0, -1], [0, 2], [0, 11], [0, 0]]],
        labels: ['M1', 'M2']
      };
      calculateAxisMinMax(axis, new Map());
      expect(axis.minValue).to.equal(0);
      expect(axis.maxValue).to.equal(11);
    });

    it('should ignore filtered series', () => {
      const axis = {
        metrics: [[[0, 1], [0, 10], [0, 9], [0, 3]], [[0, -1], [0, 2], [0, 11], [0, 0]]],
        labels: ['M1', 'M2']
      };
      calculateAxisMinMax(axis, new Map([['M2', true]]));
      expect(axis.minValue).to.equal(0);
      expect(axis.maxValue).to.equal(10);
    });

    it('should find the local max value', () => {
      const axis = {
        metrics: [[[0, 1], [10, 9], [20, 10], [30, 3]], [[0, -1], [10, 12], [30, 0]]],
        labels: ['M1', 'M2'],
        valuesDependOnEachOther: true
      };
      calculateAxisMinMax(axis, new Map());
      expect(axis.minValue).to.equal(0);
      expect(axis.maxValue).to.equal(12);
    });

    it('should find the local max value for stacked axis', () => {
      const axis = {
        metrics: [[[0, 1], [10, 9], [20, 10], [30, 3]], [[0, -1], [10, 12], [30, 0]]],
        labels: ['M1', 'M2'],
        valuesDependOnEachOther: true,
        valuesNeedToBeStacked: true
      };
      calculateAxisMinMax(axis, new Map());
      expect(axis.minValue).to.equal(0);
      expect(axis.maxValue).to.equal(21);
    });

    describe('calculateStackDifferences', () => {
      it('should calculate stack differences', () => {
        const axis = {
          metrics: [[[0, -1], [10, 9], [20, 10], [30, 0]], [[0, 1], [10, 17], [20, 11], [30, 2]]],
          labels: ['M1', 'M2'],
          valuesDependOnEachOther: true,
          calculateStackDifferences: true
        };
        calculateAxisMinMax(axis, new Map());
        expect(axis.minValue).to.equal(0);
        expect(axis.maxValue).to.equal(17);
      });

      it('should take gaps into acount', () => {
        const axis = {
          metrics: [[[0, -1], [10, 9], [20, 101], [30, 0]], [[0, 1], [10, 10], [30, 3]]],
          labels: ['M1', 'M2'],
          valuesDependOnEachOther: true,
          calculateStackDifferences: true
        };
        calculateAxisMinMax(axis, new Map());
        expect(axis.minValue).to.equal(0);
        expect(axis.maxValue).to.equal(101);
      });
    });
  });
});
