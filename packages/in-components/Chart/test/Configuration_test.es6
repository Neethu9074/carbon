/* eslint-env mocha */
import proxyquire from 'proxyquire';
import { expect } from 'chai';
import sinon from 'sinon';

import {
  allowedMultiplesOfRollupSizeMissingInCharts,
  allowedMillisGapsInOneSecondResolution
} from 'in-services/featureFlags';
import { number, percentage } from 'in-services/formatters/number';
import Renderer from 'in-components/Chart/renderer/Renderer';

describe('in-components/Chart/Configuration', () => {
  let renderCallback;
  let Config;

  beforeEach(() => {
    Config = proxyquire('in-components/Chart/Configuration', {
      'in-charts/canvas': {
        updateCanvasDimensions: () => {}
      }
    }).default;
    renderCallback = sinon.stub();
  });

  describe('constuctor', () => {
    it('should not call render initially', () => {
      new Config(getCanvasMock(), renderCallback);
      expect(renderCallback).to.have.callCount(0);
    });
  });

  describe('update', () => {
    it('should copy the given config', () => {
      const config = new Config(getCanvasMock(), renderCallback);
      config.update({ y1: {}, timeConfig: { windowSize: 60000, to: null }, foo: 'bar' });
      expect(config.y1).to.deep.equal({
        renderer: Renderer.line,
        formatter: [number],
        numOfSeries: 0,
        colors: [],
        colors100: []
      });
      expect(config.timeConfig).to.deep.equal({ windowSize: 60000, to: null });
      expect(config.foo).to.equal('bar');
    });

    it('should stack metric values on stacked renderer', () => {
      const config = new Config(getCanvasMock(), renderCallback);
      config.update({
        y1: {
          renderer: Renderer.stackedArea
        },
        timeConfig: { windowSize: 60000, to: null }
      });
      expect(config.y1).to.deep.equal({
        formatter: [number],
        renderer: Renderer.stackedArea,
        numOfSeries: 0,
        colors: [],
        colors100: [],
        valuesNeedToBeStacked: true,
        valuesDependOnEachOther: true
      });
    });

    it('should mark the metrics and set the formatter depend on each other for countErrorBar', () => {
      const config = new Config(getCanvasMock(), renderCallback);
      config.update({
        y1: {
          renderer: Renderer.countErrorBar
        },
        timeConfig: { windowSize: 60000, to: null }
      });
      expect(config.y1).to.deep.equal({
        formatter: [number, percentage],
        renderer: Renderer.countErrorBar,
        numOfSeries: 0,
        colors: ['#c6eaff', '#f06392'],
        colors100: ['#00bdff', '#f06392'],
        valuesDependOnEachOther: true
      });
    });

    describe('enrichConfig', () => {
      it('should enrich config with further properties', () => {
        const config = new Config(getCanvasMock(), renderCallback);
        expect(config.rollup).to.be.undefined;
        expect(config.rollupLabel).to.be.undefined;
        expect(config.y1).to.be.undefined;

        config.update({ y1: {}, timeConfig: { windowSize: 60000, to: null } });
        expect(config.rollup).to.equal(1000);
        expect(config.rollupLabel).to.equal('1s');
      });
    });
  });

  describe('calculateMaxMillisBetweenDatapoints', () => {
    it('should use hard defined rollups if no is defined', () => {
      const config = new Config(getCanvasMock(), renderCallback);
      config.rollup = 1000;
      const rollup = config.calculateMaxMillisBetweenDatapoints();
      expect(rollup).to.equal(allowedMillisGapsInOneSecondResolution);
    });

    it('should multiply pre defined rollup', () => {
      const config = new Config(getCanvasMock(), renderCallback);
      config.update({ y1: {}, timeConfig: { windowSize: 60000, to: null } });
      const rollup = config.calculateMaxMillisBetweenDatapoints();
      expect(rollup).to.equal(allowedMultiplesOfRollupSizeMissingInCharts * 1000);
    });
  });

  describe('scale', () => {
    it('should create scale on update', () => {
      const config = new Config(getCanvasMock(), renderCallback);
      expect(config.scales).to.be.undefined;

      config.update({ y1: {}, timeConfig: { windowSize: 60000, to: null } });
      expect(config.scales).to.not.equal(undefined);
    });
  });

  describe('getAllDomainValues', () => {
    it('should create collected domains lazy', () => {
      const config = new Config(getCanvasMock(), renderCallback);
      expect(config.allDomainValues).to.be.undefined;
      config.getAllDomainValues();
      expect(config.allDomainValues).not.to.be.undefined;
    });

    it('should contain all domain values', () => {
      const config = new Config(getCanvasMock(), renderCallback);
      expect(config.getAllDomainValues()).to.deep.equal([]);

      config.update({
        y1: { labels: ['a'], metrics: [[[0], [1], [-1]], [[42], [1], [-1]]] },
        y2: { labels: ['a'], metrics: [[[10], [11], [-1]], [[-42], [0], [2]]] },
        timeConfig: { windowSize: 60000, to: null }
      });
      expect(config.getAllDomainValues()).to.be.an('array');
      expect(config.getAllDomainValues()).to.have.length(8);
      expect(config.getAllDomainValues()).to.have.members([0, 1, -1, 42, 10, 11, 2, -42]);
    });
  });

  describe('calculateBlocks', () => {
    it('should extract blocks according to the given rollup', () => {
      const config = new Config(getCanvasMock(), renderCallback);

      let blocks = config.calculateBlocks([[0, 0], [1000, 1], [2000, 5], [3000, 10], [4000, 10], [5000, 9], [6000, 0]]);
      expect(blocks).to.have.length(1);

      config.maxDistanceBetweenDatapointsInMillis = 2000;
      blocks = config.calculateBlocks([[0, 0], [2000, 1], [5000, 10], [6000, 10], [7000, 9], [10000, 0]]);
      expect(blocks).to.have.length(3);
      expect(blocks[0].map(d => d[0])).to.deep.equal([0, 2000]);
      expect(blocks[1].map(d => d[0])).to.deep.equal([5000, 6000, 7000]);
      expect(blocks[2].map(d => d[0])).to.deep.equal([10000]);

      expect(config.calculateBlocks([])).to.have.length(0);
    });
  });

  describe('getFormatterForAxis', () => {
    it('should split formatter according to number of data series', () => {
      const config = new Config(getCanvasMock(), renderCallback);

      let formatter = config.getFormatterForAxis({
        numOfSeries: 4
      });
      expect(formatter).to.have.length(4);

      formatter = config.getFormatterForAxis({
        numOfSeries: 2,
        formatter: 'test'
      });
      expect(formatter).to.have.length(2);
      expect(formatter).to.deep.equal(['test', 'test']);
    });

    it('should keep formatter series if configured', () => {
      const config = new Config(getCanvasMock(), renderCallback);

      let formatter = config.getFormatterForAxis({
        formatter: [42, 'foobar']
      });
      expect(formatter).to.have.length(2);
      expect(formatter).to.deep.equal([42, 'foobar']);
    });
  });
});

function getCanvasMock() {
  return {
    width: 100,
    height: 50,
    getContext: () => {}
  };
}
