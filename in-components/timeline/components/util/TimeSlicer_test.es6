/* eslint-env mocha */
import {expect} from 'chai';

import TimeSlicer from './TimeSlicer';

describe('in-components/timeline/components/util/TimeSlicer', () => {

  const MIN = 100;
  const MAX = 200;

  it('should provide bounds', () => {

    const slicer = new TimeSlicer({
      min: MIN,
      max: MAX
    });
    expect(slicer.size()).to.equal(2);
    expect(slicer.get(0)).to.equal(MIN);
    expect(slicer.get(1)).to.equal(MAX);
  });

  it('should slice ranges', () => {

    const slicer = new TimeSlicer({
      min: MIN,
      max: MAX
    });

    const firstSlices = 8;
    slicer.slice(MIN, MIN + firstSlices, firstSlices);
    expect(slicer.size()).to.equal(firstSlices + 2);
    for (const i of Array(firstSlices - 1).keys()) {
      expect(slicer.get(i)).to.equal(MIN + i);
    }
    expect(slicer.get(firstSlices + 1)).to.equal(MAX);

    const secondSlices = 4;
    slicer.slice(MIN + firstSlices, MAX, secondSlices);
    expect(slicer.size()).to.equal(firstSlices + secondSlices + 1);
    const sliceFactor = (MAX - (MIN + firstSlices)) / secondSlices;
    for (const i of Array(secondSlices).keys()) {
      expect(slicer.get(firstSlices + i)).to.equal(MIN + firstSlices + sliceFactor * i);
    }
    expect(slicer.get(slicer.size() - 1)).to.equal(MAX);
  });
});
