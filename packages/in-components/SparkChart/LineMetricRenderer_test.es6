/* eslint-env mocha */
import { expect } from 'chai';

import LineMetricRenderer from 'in-components/SparkChart/LineMetricRenderer';

describe('in-components/SparkChart/LineMetricRenderer', () => {
  let lineMetricRenderer;

  beforeEach(() => {
    lineMetricRenderer = new LineMetricRenderer(getCanvasMock());
    lineMetricRenderer.update({
      timeframe: { windowSize: 6000, to: 6000 },
      rollup: 1000,
      metrics: [[0, 0], [1000, 1], [2000, 5], [5000, 9], [3000, 10], [6000, 0]]
    });
  });

  describe('scale', () => {
    it('should update the internal scales according to the given metric values', () => {
      expect(lineMetricRenderer.yScale.getRangeFrom()).to.equal(0);
      expect(lineMetricRenderer.yScale.getRangeTo()).to.equal(getCanvasMock().height);
      expect(lineMetricRenderer.yScale.getDomainFrom()).to.equal(10);
      expect(lineMetricRenderer.yScale.getDomainTo()).to.equal(0);
    });

    it('should generate proper x pixel values for given timestamps', () => {
      expect(lineMetricRenderer.getX([0])).to.equal(0);
      expect(lineMetricRenderer.getX([6000])).to.equal(100);
      expect(lineMetricRenderer.getX([3000])).to.equal(50);
    });

    it('should generate proper y pixel values for given timestamps', () => {
      expect(lineMetricRenderer.getY([0, 0])).to.equal(50);
      expect(lineMetricRenderer.getY([0, 10])).to.equal(0);
      expect(lineMetricRenderer.getY([0, 5])).to.equal(25);
    });
  });

  describe('calculateMaxMetricValue', () => {
    it('should extract the maximum metric value', () => {
      expect(
        lineMetricRenderer.calculateMaxMetricValue([[42, 0], [1000, 1], [6000, 0], [3000, 10], [2000, 5], [5000, 9]])
      ).to.equal(10);

      expect(lineMetricRenderer.calculateMaxMetricValue([])).to.equal(0);

      expect(lineMetricRenderer.calculateMaxMetricValue([[42, 1], [1000, -1]])).to.equal(1);
    });

    it('should extract blocks according to the given rollup', () => {
      let blocks = lineMetricRenderer.calculateBlocks(
        [[0, 0], [1000, 1], [2000, 5], [3000, 10], [4000, 10], [5000, 9], [6000, 0]],
        1000
      );
      expect(blocks).to.have.length(1);

      blocks = lineMetricRenderer.calculateBlocks(
        [[0, 0], [1000, 1], [3000, 10], [4000, 10], [5000, 9], [7000, 0]],
        1000
      );
      expect(blocks).to.have.length(3);
      expect(blocks[0].map(d => d.xDomain)).to.deep.equal([0, 1000]);
      expect(blocks[1].map(d => d.xDomain)).to.deep.equal([3000, 4000, 5000]);
      expect(blocks[2].map(d => d.xDomain)).to.deep.equal([7000]);

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
