/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
/* eslint-env mocha */
import { expect } from 'chai';

import {
  allowedMultiplesOfRollupSizeMissingInCharts,
  allowedMillisGapsInOneSecondResolution
} from 'in-services/featureFlags';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { number } from 'in-services/formatters/number';
import Config from 'in-components/Chart/Configuration';

describe('in-components/Chart/Configuration', () => {
  const defaultProps = Object.freeze({
    y1: { metrics: [] },
    y2: { metrics: [] },
    timeConfig: { windowSize: 60000, to: null }
  });

  describe('constuctor', () => {
    it('should set initial metrics as filtered', () => {
      const props = {
        y1: { labels: ['a', 'b'], metricIds: ['idA', 'idB'], defaultDisabledMetrics: ['idB'] },
        timeConfig: { windowSize: 60000, to: null }
      };
      const config = new Config(props);
      expect(config.filteredDataSeries).to.be.an.instanceof(Set);
      expect(config.filteredDataSeries.size).to.equal(1);
      expect(config.filteredDataSeries.values().next().value).to.equal('y1-1');
    });
  });

  describe('update', () => {
    it('should copy the given config', () => {
      const props = { y1: {}, timeConfig: { windowSize: 60000, to: null }, foo: 'bar' };
      const config = new Config(props);
      expect(config.y1).to.deep.equal({
        renderer: Renderer.line,
        formatter: [number],
        numOfSeries: 0,
        colors: [],
        colors50: [],
        colors100: [],
        minValue: 0,
        maxValue: 1
      });
      expect(config.timeConfig).to.deep.equal({ windowSize: 60000, to: null });
      expect(config.foo).to.equal('bar');
    });

    it('should stack metric values on stacked renderer', () => {
      const props = {
        y1: {
          renderer: Renderer.stackedArea
        },
        timeConfig: { windowSize: 60000, to: null }
      };
      const config = new Config(props);
      expect(config.y1).to.deep.equal({
        formatter: [number],
        renderer: Renderer.stackedArea,
        numOfSeries: 0,
        colors: [],
        colors50: [],
        colors100: [],
        valuesNeedToBeStacked: true,
        valuesDependOnEachOther: true,
        minValue: 0,
        maxValue: 1
      });
    });

    it('should allow force disabling metrics', () => {
      const props = {
        y1: {
          labels: ['a', 'b'],
          metricIds: ['idA', 'idB'],
          forceDisabledMetrics: ['idB']
        },
        timeConfig: { windowSize: 60000, to: null }
      };

      const config = new Config(props);

      expect(config.filteredDataSeries.size).to.equal(1);
      expect(config.filteredDataSeries.keys().next().value).to.equal('y1-1');

      props.y1.forceDisabledMetrics = [];

      config.update(props);

      expect(config.filteredDataSeries.size).to.equal(0);
    });

    describe('enrichConfig', () => {
      it('should enrich config with further properties', () => {
        const config = new Config(defaultProps);
        expect(config.rollup).to.equal(1000);
        expect(config.rollupLabel).to.equal('metric.metric.1s');
        expect(config.y1).not.to.equal(undefined);

        config.update({ y1: {}, timeConfig: { windowSize: 60000, to: 20000 } });
        expect(config.rollup).to.equal(3600000);
      });
    });
  });

  describe('calculateMaxMillisBetweenDatapoints', () => {
    it('should use hard defined rollups if no is defined', () => {
      const config = new Config(defaultProps);
      config.rollup = 1000;
      const rollup = config.calculateMaxMillisBetweenDatapoints();
      expect(rollup).to.equal(allowedMillisGapsInOneSecondResolution);
    });

    it('should multiply pre defined rollup', () => {
      const config = new Config(defaultProps);
      config.update({ y1: {}, timeConfig: { windowSize: 60000, to: null } });
      const rollup = config.calculateMaxMillisBetweenDatapoints();
      expect(rollup).to.equal(allowedMultiplesOfRollupSizeMissingInCharts * 1000);
    });
  });

  describe('scale', () => {
    it('should create scale', () => {
      const config = new Config(defaultProps);
      expect(config.scales).to.not.equal(undefined);
    });
  });

  describe('getAllDomainValues', () => {
    it('should create collected domains lazy', () => {
      const config = new Config(defaultProps);
      expect(config.allDomainValues).to.equal(null);
      config.getAllDomainValues();
      expect(config.allDomainValues).to.deep.equal([]);
    });

    it('should contain all domain values', () => {
      const config = new Config(defaultProps);
      expect(config.getAllDomainValues()).to.deep.equal([]);

      config.update({
        y1: {
          labels: ['a'],
          metrics: [
            [[0], [1], [-1]],
            [[42], [1], [-1]]
          ]
        },
        y2: {
          labels: ['a'],
          metrics: [
            [[10], [11], [-1]],
            [[-42], [0], [2]]
          ]
        },
        timeConfig: { windowSize: 60000, to: null }
      });
      expect(config.getAllDomainValues()).to.be.an('array');
      expect(config.getAllDomainValues()).to.have.length(8);
      expect(config.getAllDomainValues()).to.have.members([0, 1, -1, 42, 10, 11, 2, -42]);
    });
  });

  describe('calculateBlocks', () => {
    it('should extract blocks according to the given rollup', () => {
      const config = new Config(defaultProps);

      let blocks = config.calculateBlocks([
        [0, 0],
        [1000, 1],
        [2000, 5],
        [3000, 10],
        [4000, 10],
        [5000, 9],
        [6000, 0]
      ]);
      expect(blocks).to.have.length(1);

      config.maxDistanceBetweenDatapointsInMillis = 2000;
      blocks = config.calculateBlocks([
        [0, 0],
        [2000, 1],
        [5000, 10],
        [6000, 10],
        [7000, 9],
        [10000, 0]
      ]);
      expect(blocks).to.have.length(3);
      expect(blocks[0].map(d => d[0])).to.deep.equal([0, 2000]);
      expect(blocks[1].map(d => d[0])).to.deep.equal([5000, 6000, 7000]);
      expect(blocks[2].map(d => d[0])).to.deep.equal([10000]);

      expect(config.calculateBlocks([])).to.have.length(0);
    });
  });

  describe('getFormatterForAxis', () => {
    it('should split formatter according to number of data series', () => {
      const config = new Config(defaultProps);

      let formatter = config.getFormatterForAxis({
        numOfSeries: 4
      });
      expect(formatter).to.have.length(4);

      formatter = config.getFormatterForAxis({
        numOfSeries: 2,
        formatter: 'test'
      });
      expect(formatter).to.have.length(2);
      expect(formatter).to.deep.equal([
        {
          compact: 'test',
          detailed: 'test'
        },
        {
          compact: 'test',
          detailed: 'test'
        }
      ]);
    });

    it('should keep formatter series if configured', () => {
      const config = new Config(defaultProps);

      let formatter = config.getFormatterForAxis({
        formatter: [42, 'foobar']
      });
      expect(formatter).to.have.length(2);
      expect(formatter).to.deep.equal([42, 'foobar']);
    });
  });
});
