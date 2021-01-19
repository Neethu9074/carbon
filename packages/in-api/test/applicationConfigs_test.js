/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
/* eslint-env mocha */
import { expect } from 'chai';

import {
  mapMatchSpecificationListToTree,
  mapMatchSpecificationTreeToList,
  annotateWithTypes,
  splitBy,
  split
} from 'in-api/applicationConfigs';

describe('in-api/applicationConfigs', () => {
  describe('annotateWithTypes', () => {
    it('should annote conjunction nodes with BINARY_OP and leafs as leafs', () => {
      const tree = {
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
      };

      annotateWithTypes(tree);
      expect(tree).to.deep.equal({
        type: 'BINARY_OP',
        conjunction: 'OR',
        left: { key: 'A', type: 'LEAF' },
        right: {
          type: 'BINARY_OP',
          conjunction: 'OR',
          left: {
            type: 'BINARY_OP',
            conjunction: 'AND',
            left: { key: 'B', type: 'LEAF' },
            right: { key: 'C', type: 'LEAF' }
          },
          right: {
            type: 'BINARY_OP',
            conjunction: 'AND',
            left: { key: 'D', type: 'LEAF' },
            right: {
              type: 'BINARY_OP',
              conjunction: 'AND',
              left: { key: 'E', type: 'LEAF' },
              right: { key: 'F', type: 'LEAF' }
            }
          }
        }
      });
    });
  });

  describe('mapMatchSpecificationListToTree', () => {
    it('should return node as root if only one item is present', () => {
      const tree = mapMatchSpecificationListToTree([{ key: 'A', conjunction: 'AND' }]);
      expect(tree).to.deep.equal({
        key: 'A',
        type: 'LEAF'
      });
    });

    it('should identify removed nodes', () => {
      const tree = mapMatchSpecificationListToTree([
        { key: 'A', conjunction: 'OR' },
        { key: 'B', conjunction: 'AND' },
        { key: 'C', conjunction: 'OR' },
        { key: 'D', conjunction: 'AND' },
        { key: 'E', conjunction: 'AND' },
        { key: 'F', conjunction: 'AND' }
      ]);
      expect(tree).to.deep.equal({
        type: 'BINARY_OP',
        conjunction: 'OR',
        left: { key: 'A', type: 'LEAF' },
        right: {
          type: 'BINARY_OP',
          conjunction: 'OR',
          left: {
            type: 'BINARY_OP',
            conjunction: 'AND',
            left: { key: 'B', type: 'LEAF' },
            right: { key: 'C', type: 'LEAF' }
          },
          right: {
            type: 'BINARY_OP',
            conjunction: 'AND',
            left: { key: 'D', type: 'LEAF' },
            right: {
              type: 'BINARY_OP',
              conjunction: 'AND',
              left: { key: 'E', type: 'LEAF' },
              right: { key: 'F', type: 'LEAF' }
            }
          }
        }
      });
    });
  });

  describe('mapMatchSpecificationTreeToList', () => {
    it('should convert a tree into a list structure', () => {
      expect(mapMatchSpecificationTreeToList(mapMatchSpecificationListToTree([]))).to.deep.equal([]);

      expect(mapMatchSpecificationTreeToList(mapMatchSpecificationListToTree([{ key: 'A' }]))).to.deep.equal([
        { key: 'A', type: 'LEAF' }
      ]);

      expect(
        mapMatchSpecificationTreeToList(
          mapMatchSpecificationListToTree([
            { key: 'A', conjunction: 'OR' },
            { key: 'B', conjunction: 'AND' },
            { key: 'C', conjunction: 'OR' },
            { key: 'D', conjunction: 'AND' },
            { key: 'E', conjunction: 'AND' },
            { key: 'F' }
          ])
        )
      ).to.deep.equal([
        { key: 'A', type: 'LEAF', conjunction: 'OR' },
        { key: 'B', type: 'LEAF', conjunction: 'AND' },
        { key: 'C', type: 'LEAF', conjunction: 'OR' },
        { key: 'D', type: 'LEAF', conjunction: 'AND' },
        { key: 'E', type: 'LEAF', conjunction: 'AND' },
        { key: 'F', type: 'LEAF' }
      ]);
    });
  });

  describe('splitBy', () => {
    it('should return list if no OR is found', () => {
      expect(splitBy([], 'OR')).to.deep.equal([]);
      expect(splitBy([], 'AND')).to.deep.equal([]);

      expect(
        splitBy(
          [
            { key: 'A', conjunction: 'AND' },
            { key: 'B', conjunction: 'AND' },
            { key: 'C', conjunction: 'AND' }
          ],
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

      expect(
        splitBy([{ key: 'A', conjunction: 'AND' }, { key: 'B', conjunction: 'OR' }, { key: 'C' }], 'OR')
      ).to.deep.equal({
        conjunction: 'OR',
        left: [{ key: 'A', conjunction: 'AND' }, { key: 'B' }],
        right: [{ key: 'C' }]
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
        splitBy([{ key: 'A', conjunction: 'AND' }, { key: 'B', conjunction: 'AND' }, { key: 'C' }], 'AND')
      ).to.deep.equal({
        conjunction: 'AND',
        left: [{ key: 'A' }],
        right: [{ key: 'B', conjunction: 'AND' }, { key: 'C' }]
      });

      expect(
        splitBy([{ key: 'A', conjunction: 'OR' }, { key: 'B', conjunction: 'AND' }, { key: 'C' }], 'AND')
      ).to.deep.equal({
        conjunction: 'AND',
        left: [{ key: 'A', conjunction: 'OR' }, { key: 'B' }],
        right: [{ key: 'C' }]
      });
    });

    it('if the conjunction hit is the last element, ignore it', () => {
      const input = [
        { key: 'A', conjunction: 'OR' },
        { key: 'B', conjunction: 'AND' }
      ];
      expect(splitBy(input, 'AND')).to.deep.equal(input);
    });
  });

  describe('split', () => {
    it('should return an empty array on undefined or empty array', () => {
      expect(split([])).to.deep.equal([]);
      expect(split(undefined)).to.deep.equal([]);
    });

    it('should split the list into a tree structure', () => {
      expect(
        split([
          { key: 'A', conjunction: 'AND' },
          { key: 'B', conjunction: 'OR' },
          { key: 'C', conjunction: 'AND' },
          { key: 'D', conjunction: 'OR' }
        ])
      ).to.deep.equal({
        conjunction: 'OR',
        left: {
          conjunction: 'AND',
          left: { key: 'A' },
          right: { key: 'B' }
        },
        right: {
          conjunction: 'AND',
          left: { key: 'C' },
          right: { key: 'D' }
        }
      });
    });
  });
});
