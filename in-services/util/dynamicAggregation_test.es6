/* eslint-env mocha */
import { expect } from 'chai';

import { getBlockSizeMillis, getPredefinedBlockSizeMillisForBlockSize } from 'in-services/util/dynamicAggregation';

describe('in-services/util/dynamicAggregation', () => {
  it('should take maxDataPoints over pixelWidth if there are to less datapoints', () => {
    expect(
      getBlockSizeMillis({ windowSize: 1000, maxDataPoints: 10, minPixelsPerBlock: 1, width: 1000, rollup: 1 })
    ).to.equal(100);
  });

  it('should take pixelWidth overmaxDataPoints if there are to less datapoints', () => {
    expect(
      getBlockSizeMillis({ windowSize: 1000, maxDataPoints: 1000, minPixelsPerBlock: 50, width: 1000, rollup: 1 })
    ).to.equal(50);
  });

  it('should take rollup into account when calculating the block size', () => {
    expect(
      getBlockSizeMillis({ windowSize: 1000, maxDataPoints: 100, minPixelsPerBlock: 1, width: 1000, rollup: 1 })
    ).to.equal(10);
    expect(
      getBlockSizeMillis({ windowSize: 1000, maxDataPoints: 100, minPixelsPerBlock: 1, width: 1000, rollup: 10 })
    ).to.equal(10);
    expect(
      getBlockSizeMillis({ windowSize: 1000, maxDataPoints: 100, minPixelsPerBlock: 1, width: 1000, rollup: 20 })
    ).to.equal(20);
    expect(
      getBlockSizeMillis({ windowSize: 1000, maxDataPoints: 100, minPixelsPerBlock: 1, width: 1000, rollup: 100 })
    ).to.equal(100);
    expect(
      getBlockSizeMillis({ windowSize: 1000, maxDataPoints: 100, minPixelsPerBlock: 1, width: 1000, rollup: 1000 })
    ).to.equal(1000);
  });

  it('should increase blocksize if there are to less pixels available', () => {
    expect(
      getBlockSizeMillis({ windowSize: 1000, maxDataPoints: 1000, minPixelsPerBlock: 50, width: 100, rollup: 1 })
    ).to.equal(500);
  });

  it('should round up to the next big predefined rollup', () => {
    expect(getPredefinedBlockSizeMillisForBlockSize(0)).to.equal(1000);
    expect(getPredefinedBlockSizeMillisForBlockSize(1)).to.equal(1000);
    expect(getPredefinedBlockSizeMillisForBlockSize(999)).to.equal(1000);
    expect(getPredefinedBlockSizeMillisForBlockSize(1000)).to.equal(1000);
    expect(getPredefinedBlockSizeMillisForBlockSize(1001)).to.equal(1000 * 5);
    expect(getPredefinedBlockSizeMillisForBlockSize(Number.MAX_VALUE)).to.equal(1000 * 60 * 60 * 24 * 7);
  });
});
