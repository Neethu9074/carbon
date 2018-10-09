/* eslint-env mocha */
import { expect } from 'chai';

import { mapMatchSpecificationListToTree, splitBy } from 'in-api/applicationConfigs';

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
      expect(tree).to.deep.equal({
        conjunction: 'OR',
        left: { key: 'A' },
        right: {
          conjunction: 'OR',
          left: {
            conjunction: 'AND',
            left: { key: 'B' },
            right: { key: 'C' }
          },
          right: {
            conjunction: 'AND',
            left: { key: 'D' },
            right: {
              conjunction: 'AND',
              left: { key: 'E' },
              right: { key: 'F' }
            }
          }
        }
      });
    });
  });

  describe('splitBy', () => {
    it('should return list if no OR is found', () => {
      expect(splitBy([], 'OR')).to.deep.equal([]);
      expect(splitBy([], 'AND')).to.deep.equal([]);

      expect(
        splitBy(
          [{ key: 'A', conjunction: 'AND' }, { key: 'B', conjunction: 'AND' }, { key: 'C', conjunction: 'AND' }],
          'OR'
        )
      ).to.deep.equal([
        { key: 'A', conjunction: 'AND' },
        { key: 'B', conjunction: 'AND' },
        { key: 'C', conjunction: 'AND' }
      ]);
    });

    it('should split by first OR', () => {
      expect(splitBy([{ key: 'A', conjunction: 'OR' }], 'OR')).to.deep.equal([{ key: 'A', conjunction: 'OR' }]);
      expect(splitBy([{ key: 'A', conjunction: 'OR' }, { key: 'B' }], 'OR')).to.deep.equal({
        conjunction: 'OR',
        left: [{ key: 'A' }],
        right: [{ key: 'B' }]
      });

      expect(
        splitBy([{ key: 'A', conjunction: 'OR' }, { key: 'B', conjunction: 'OR' }, { key: 'C' }], 'OR')
      ).to.deep.equal({
        conjunction: 'OR',
        left: [{ key: 'A' }],
        right: [{ key: 'B', conjunction: 'OR' }, { key: 'C' }]
      });
    });

    it('should split by first AND', () => {
      expect(splitBy([{ key: 'A', conjunction: 'AND' }], 'AND')).to.deep.equal([{ key: 'A', conjunction: 'AND' }]);
      expect(splitBy([{ key: 'A', conjunction: 'AND' }, { key: 'B' }], 'AND')).to.deep.equal({
        conjunction: 'AND',
        left: [{ key: 'A' }],
        right: [{ key: 'B' }]
      });

      expect(
        splitBy(
          [
            { key: 'A', conjunction: 'AND' },
            { key: 'B', conjunction: 'AND' },
            {
              key: 'C'
            }
          ],
          'AND'
        )
      ).to.deep.equal({
        conjunction: 'AND',
        left: [{ key: 'A' }],
        right: [{ key: 'B', conjunction: 'AND' }, { key: 'C' }]
      });
    });
  });
});
