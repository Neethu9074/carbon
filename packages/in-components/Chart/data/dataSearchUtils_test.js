/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
/* eslint-env mocha */
import { expect } from 'chai';

import {
  collectAllDomainValues,
  getNearestDataPointDomainForTimestamp,
  collectAllDataPointsAtTime
} from 'in-components/Chart/data/dataSearchUtils';

describe('in-components/Chart/Chart', () => {
  describe('getNearestDataPointDomainForTimestamp', () => {
    it('should return null if null is given', () => {
      expect(getNearestDataPointDomainForTimestamp(null)).to.equal(null);
    });

    it('should return the nearest data point domains', () => {
      const config = {};
      config.getAllDomainValues = () => collectAllDomainValues(config);

      config.y1 = {
        metrics: [
          [[0], [1], [2], [3], [4]],
          [[0], [11], [2], [-13], [4]]
        ]
      };
      config.y2 = {
        metrics: [
          [[0], [-1], [-2], [-3], [4]],
          [[0], [15], [1001], [-2], [-13], [4]]
        ]
      };

      expect(getNearestDataPointDomainForTimestamp(config, -100000)).to.equal(-13);
      expect(getNearestDataPointDomainForTimestamp(config, -1)).to.equal(-1);
      expect(getNearestDataPointDomainForTimestamp(config, 0)).to.equal(0);
      expect(getNearestDataPointDomainForTimestamp(config, 1)).to.equal(1);
      expect(getNearestDataPointDomainForTimestamp(config, 2)).to.equal(2);
      expect(getNearestDataPointDomainForTimestamp(config, 11)).to.equal(11);
      expect(getNearestDataPointDomainForTimestamp(config, 12)).to.equal(11);
      expect(getNearestDataPointDomainForTimestamp(config, 13)).to.equal(11);
      expect(getNearestDataPointDomainForTimestamp(config, 14)).to.equal(15);
      expect(getNearestDataPointDomainForTimestamp(config, 15)).to.equal(15);
      expect(getNearestDataPointDomainForTimestamp(config, 42)).to.equal(15);
      expect(getNearestDataPointDomainForTimestamp(config, 100000)).to.equal(1001);
    });

    it('should return the nearest data point domains floored down', () => {
      const config = {};
      config.getAllDomainValues = () => collectAllDomainValues(config);

      config.y1 = {
        metrics: [
          [[0], [1], [2], [3], [4]],
          [[0], [11], [2], [-13], [4]]
        ]
      };
      config.y2 = {
        metrics: [
          [[0], [-1], [-2], [-3], [4]],
          [[0], [15], [1001], [-2], [-13], [4]]
        ]
      };

      expect(getNearestDataPointDomainForTimestamp(config, -1, true)).to.equal(-1);
      expect(getNearestDataPointDomainForTimestamp(config, 0, true)).to.equal(0);
      expect(getNearestDataPointDomainForTimestamp(config, 1, true)).to.equal(1);
      expect(getNearestDataPointDomainForTimestamp(config, 2, true)).to.equal(2);
      expect(getNearestDataPointDomainForTimestamp(config, 11, true)).to.equal(11);
      expect(getNearestDataPointDomainForTimestamp(config, 12, true)).to.equal(11);
      expect(getNearestDataPointDomainForTimestamp(config, 13, true)).to.equal(11);
      expect(getNearestDataPointDomainForTimestamp(config, 14, true)).to.equal(11);
      expect(getNearestDataPointDomainForTimestamp(config, 15, true)).to.equal(15);
      expect(getNearestDataPointDomainForTimestamp(config, 42, true)).to.equal(15);
      expect(getNearestDataPointDomainForTimestamp(config, 1000, true)).to.equal(15);
      expect(getNearestDataPointDomainForTimestamp(config, 100000, true)).to.equal(1001);
    });
  });

  describe('collectAllMetricValuesAtTime', () => {
    it('should return null if null is given', () => {
      const config = {};
      config.getAllDomainValues = () => collectAllDomainValues(config);
      expect(collectAllDataPointsAtTime(config, null)).to.equal(null);
    });

    it('should return all data points at the given time', () => {
      const config = {};
      config.getAllDomainValues = () => collectAllDomainValues(config);

      config.y1 = {
        labels: ['calls'],
        metrics: [[[0], [1], [2], [3], [4]]]
      };
      config.y2 = {
        labels: ['count', 'foobar'],
        metrics: [
          [[-1], [2], [4]],
          [[3], [4], [42]]
        ]
      };

      expect(collectAllDataPointsAtTime(config, -100000)).to.deep.equal({});
      expect(collectAllDataPointsAtTime(config, -1)).to.deep.equal({
        y2: [[-1]]
      });
      expect(collectAllDataPointsAtTime(config, 0)).to.deep.equal({
        y1: [[0]]
      });
      expect(collectAllDataPointsAtTime(config, 2)).to.deep.equal({
        y1: [[2]],
        y2: [[2]]
      });
      expect(collectAllDataPointsAtTime(config, 4)).to.deep.equal({
        y1: [[4]],
        y2: [[4], [4]]
      });
    });
  });
});
