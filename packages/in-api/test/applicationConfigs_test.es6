/* eslint-env mocha */
import { expect } from 'chai';

import { mapMatchSpecificationListToTree } from 'in-api/applicationConfigs';

describe('in-api/applicationConfigs', () => {
  describe('mapMatchSpecificationListToTree', () => {
    it('should return node as root if only one item is present', () => {
      const tree = mapMatchSpecificationListToTree([{ key: 'A' }]);
      expect(tree.key).to.equal('A');
      expect(tree.left).to.equal(undefined);
      expect(tree.right).to.equal(undefined);
    });

    it('should identify removed nodes', () => {
      const tree = mapMatchSpecificationListToTree([
        { key: 'A', conjunction: 'OR' },
        { key: 'B', conjunction: 'AND' },
        { key: 'C', conjunction: 'OR' },
        { key: 'D', conjunction: 'AND' },
        { key: 'E', conjunction: 'AND' },
        { key: 'F' }
      ]);
      expect(tree.conjunction).to.equal('OR');

      expect(tree.left.key).to.equal('A');
      expect(tree.right.conjunction).to.equal('OR');

      expect(tree.right.left.conjunction).to.equal('AND');

      expect(tree.right.left.left.key).to.equal('B');
      expect(tree.right.left.right.key).to.equal('C');

      expect(tree.right.right.conjunction).to.equal('AND');

      expect(tree.right.right.right.key).to.equal('F');
      expect(tree.right.right.left.conjunction).to.equal('AND');

      expect(tree.right.right.left.left.key).to.equal('D');
      expect(tree.right.right.left.right.key).to.equal('E');
    });
  });
});
