/* eslint-env mocha, node */
import { expect } from 'chai';

import {
  flatten,
  getCenterPosition,
  getDirectionForPoints,
  getNormalizedDirectionForPoints,
  shortenPathAtSourceAndDestination
} from 'in-map/misc/Connections';

describe('in-map', () => {
  describe('misc/Connections', () => {
    it('should caluclate the correct direction', () => {
      let direction = getDirectionForPoints({ x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 });
      expect(direction).to.deep.equal({ x: 1, y: 0, z: 0 });

      direction = getNormalizedDirectionForPoints({ x: 0, y: 1, z: 0 }, { x: 1, y: 0, z: 0 });
      expect(direction).to.deep.equal({ x: 1 / Math.sqrt(2), y: 1 / -Math.sqrt(2), z: 0 });

      direction = getNormalizedDirectionForPoints({ x: 0, y: 0, z: 2 }, { x: 1, y: 0, z: 0 });
      expect(direction).to.deep.equal({ x: 1 / Math.sqrt(5), y: 0, z: -2 / Math.sqrt(5) });
    });

    it('should shorten the path by 0.5 units', () => {
      const stepMoved = 0.5;
      const shortenedPath = shortenPathAtSourceAndDestination([{ x: 0, y: 0, z: 0 }, { x: 10, y: 0, z: 0 }]);
      expect(shortenedPath).to.deep.equal([{ x: stepMoved, y: 0, z: 0 }, { x: 10 - stepMoved, y: 0, z: 0 }]);
    });

    it('should flatten path from vector array to value array', () => {
      const flattenedArray = flatten([{ x: 1, y: 2, z: 3 }, { x: 10, y: 9, z: 8 }]);
      expect(flattenedArray).to.deep.equal([1, 2, 3, 10, 9, 8]);
    });

    it('should calulate the center of two points', () => {
      const centerPos = getCenterPosition({ x: 1, y: 2, z: 3 }, { x: 10, y: 10, z: 10 });
      expect(centerPos.x).to.deep.equal(5.5);
      expect(centerPos.y).to.deep.equal(6);
      expect(centerPos.z).to.deep.equal(6.5);
    });
  });
});
