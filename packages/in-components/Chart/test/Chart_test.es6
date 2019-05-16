/* eslint-env mocha */
import proxyquire from 'proxyquire';
import { expect } from 'chai';

describe('in-components/Chart/Chart', () => {
  let chart;

  beforeEach(() => {
    const Config = proxyquire('in-components/Chart/Configuration', {
      'in-charts/canvas': {
        updateCanvasDimensions: () => {}
      },
      'in-components/Chart/canvasHelper': {
        createCanvas: () => ({
          getContext: () => {}
        })
      }
    }).default;

    const Chart = proxyquire('in-components/Chart/Chart.es6', {
      'in-components/Chart/Configuration': Config
    }).default;
    chart = new Chart(getCanvasMock(), {
      y1: { metrics: [] },
      timeConfig: { windowSize: 60000, to: null }
    });
  });

  describe('getNearestDataPointDomainForTimestamp', () => {
    it('should return null if null is given', () => {
      expect(chart.getNearestDataPointDomainForTimestamp(null)).to.equal(null);
    });

    it('should return the nearest data point domains', () => {
      chart.config.y1 = {
        metrics: [[[0], [1], [2], [3], [4]], [[0], [11], [2], [-13], [4]]]
      };
      chart.config.y2 = {
        metrics: [[[0], [-1], [-2], [-3], [4]], [[0], [1001], [-2], [-13], [4]]]
      };

      expect(chart.getNearestDataPointDomainForTimestamp(-100000)).to.equal(-13);
      expect(chart.getNearestDataPointDomainForTimestamp(-1)).to.equal(-1);
      expect(chart.getNearestDataPointDomainForTimestamp(0)).to.equal(0);
      expect(chart.getNearestDataPointDomainForTimestamp(1)).to.equal(1);
      expect(chart.getNearestDataPointDomainForTimestamp(2)).to.equal(2);
      expect(chart.getNearestDataPointDomainForTimestamp(42)).to.equal(11);
      expect(chart.getNearestDataPointDomainForTimestamp(100000)).to.equal(1001);
    });
  });

  describe('collectAllMetricValuesAtTime', () => {
    it('should return null if null is given', () => {
      expect(chart.collectAllDataPointsAtTime(null)).to.equal(null);
    });

    it('should return all data points at the given time', () => {
      chart.config.y1 = {
        labels: ['calls'],
        metrics: [[[0], [1], [2], [3], [4]]]
      };
      chart.config.y2 = {
        labels: ['count', 'foobar'],
        metrics: [[[-1], [2], [4]], [[3], [4], [42]]]
      };

      expect(chart.collectAllDataPointsAtTime(-100000)).to.deep.equal({});
      expect(chart.collectAllDataPointsAtTime(-1)).to.deep.equal({
        y2: {
          count: [-1]
        }
      });
      expect(chart.collectAllDataPointsAtTime(0)).to.deep.equal({
        y1: {
          calls: [0]
        }
      });
      expect(chart.collectAllDataPointsAtTime(2)).to.deep.equal({
        y1: {
          calls: [2]
        },
        y2: {
          count: [2]
        }
      });
      expect(chart.collectAllDataPointsAtTime(4)).to.deep.equal({
        y1: {
          calls: [4]
        },
        y2: {
          count: [4],
          foobar: [4]
        }
      });
    });
  });
});

function getCanvasMock() {
  return {
    width: 100,
    height: 50,
    style: {},
    getContext: () => ({
      scale: () => {}
    }),
    setAttribute: () => {}
  };
}
