/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
/* eslint-env mocha */
import { expect } from 'chai';

import LineMetricRenderer from 'in-components/SparkChart/LineMetricRenderer';

describe('in-components/SparkChart/LineMetricRenderer', () => {
  let lineMetricRenderer;

  beforeEach(() => {
    lineMetricRenderer = new LineMetricRenderer(getCanvasMock(), { width: 100, height: 50 });
    lineMetricRenderer.update({
      timeConfig: { windowSize: 6000, to: 6000 },
      rollup: 1000,
      metrics: [
        [0, 0],
        [1000, 1],
        [2000, 5],
        [5000, 9],
        [3000, 10],
        [6000, 0]
      ]
    });
  });

  describe('scale', () => {
    it('should update the internal scales according to the given metric values', () => {
      expect(lineMetricRenderer.yScale.getRangeFrom()).to.equal(0);
      expect(lineMetricRenderer.yScale.getRangeTo()).to.equal(getCanvasMock().height);
      expect(lineMetricRenderer.yScale.getDomainFrom()).to.be.above(10);
      expect(lineMetricRenderer.yScale.getDomainTo()).to.equal(0);
    });

    it('should generate proper x pixel values for given timestamps', () => {
      expect(lineMetricRenderer.getX([0])).to.equal(0);
      expect(lineMetricRenderer.getX([6000])).to.equal(100);
      expect(lineMetricRenderer.getX([3000])).to.equal(50);
    });

    it('should generate proper y pixel values for given timestamps', () => {
      expect(lineMetricRenderer.getY([0, 0])).to.equal(50);
      expect(lineMetricRenderer.getY([0, 10])).to.be.above(0);
      expect(lineMetricRenderer.getY([0, 5])).to.be.above(25);
    });
  });

  describe('calculateMetricStatistics', () => {
    it('should extract the maximum metric value', () => {
      expect(
        lineMetricRenderer.calculateMetricStatistics([
          [42, 0],
          [1000, 1],
          [6000, 0],
          [3000, 10],
          [2000, 5],
          [5000, 9]
        ]).upperBound
      ).to.be.above(10);

      expect(lineMetricRenderer.calculateMetricStatistics([]).upperBound).to.equal(0);

      expect(
        lineMetricRenderer.calculateMetricStatistics([
          [42, 1],
          [1000, -1]
        ]).upperBound
      ).to.be.above(1);
    });

    it('should extract the minimum metric value', () => {
      expect(
        lineMetricRenderer.calculateMetricStatistics([
          [42, 0],
          [1000, 1],
          [6000, 0],
          [3000, 10],
          [2000, 5],
          [5000, 9]
        ]).lowerBound
      ).to.equal(0);

      expect(lineMetricRenderer.calculateMetricStatistics([]).lowerBound).to.equal(0);

      expect(
        lineMetricRenderer.calculateMetricStatistics([
          [42, 1],
          [1000, -1]
        ]).lowerBound
      ).to.equal(-1);
    });

    it('should extract blocks according to the given rollup', () => {
      let blocks = lineMetricRenderer.calculateBlocks(
        [
          [0, 0],
          [1000, 1],
          [2000, 5],
          [3000, 10],
          [4000, 10],
          [5000, 9],
          [6000, 0]
        ],
        1000
      );
      expect(blocks).to.have.length(1);

      blocks = lineMetricRenderer.calculateBlocks(
        [
          [0, 0],
          [2000, 1],
          [5000, 10],
          [6000, 10],
          [7000, 9],
          [10000, 0]
        ],
        1000
      );
      expect(blocks).to.have.length(3);
      expect(blocks[0].map(d => d.xDomain)).to.deep.equal([0, 2000]);
      expect(blocks[1].map(d => d.xDomain)).to.deep.equal([5000, 6000, 7000]);
      expect(blocks[2].map(d => d.xDomain)).to.deep.equal([10000]);

      expect(lineMetricRenderer.calculateBlocks([], 1000)).to.have.length(0);
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
