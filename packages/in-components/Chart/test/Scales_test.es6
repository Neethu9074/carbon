/* eslint-env mocha */
import proxyquire from 'proxyquire';
import { expect } from 'chai';

import { MARGIN_TOP, MARGIN_BOTTOM, MARGIN_VERTICAL_AXIS } from 'in-components/Chart/Scales';
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
        y1: { formatter: [number] },
        y2: { labels: ['a'], metrics: [[[0, 1], [1000, 20]]], formatter: [number] },
        timeframe: { windowSize: 20000, to: 60000 },
        width: 100,
        height: 50
      });
      scales.update();

      expect(scales.x.getRangeFrom()).to.equal(MARGIN_VERTICAL_AXIS);
      expect(scales.x.getRangeTo()).to.equal(100 - MARGIN_VERTICAL_AXIS);
      expect(scales.x.getDomainFrom()).to.equal(40000);
      expect(scales.x.getDomainTo()).to.equal(60000);

      expect(scales.y1.getRangeFrom()).to.equal(50 - MARGIN_BOTTOM);
      expect(scales.y1.getRangeTo()).to.equal(MARGIN_TOP);
      expect(scales.y1.getDomainFrom()).to.equal(Number.MAX_VALUE);
      expect(scales.y1.getDomainTo()).to.equal(0);

      expect(scales.y2.getRangeFrom()).to.equal(50 - MARGIN_BOTTOM);
      expect(scales.y2.getRangeTo()).to.equal(MARGIN_TOP);
      expect(scales.y2.getDomainFrom()).to.equal(1);
      expect(scales.y2.getDomainTo()).to.equal(20);
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
        timeframe: { windowSize: 20000, to: 60000 },
        width: 100,
        height: 50
      });
      scales.update();

      expect(scales.y1.getDomainFrom()).to.equal(-1);
      expect(scales.y1.getDomainTo()).to.equal(20);

      expect(scales.y2.getDomainFrom()).to.equal(1);
      expect(scales.y2.getDomainTo()).to.equal(20);
    });

    it('should update tick positions on update', () => {
      const scales = new Scales({
        y1: { formatter: [number] },
        timeframe: { windowSize: 20000, to: 60000 },
        width: 100,
        height: 50
      });

      expect(scales.y1.tickPositions).to.be.undefined;
      scales.update();
      expect(scales.y1.tickPositions).not.to.be.undefined;
      expect(scales.y1.tickPositions).to.deep.equal(tickMock);
    });
  });
});
