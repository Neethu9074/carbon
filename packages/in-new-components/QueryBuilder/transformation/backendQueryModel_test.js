/* eslint-env mocha */

import { expect } from 'chai';

import {
  TAG as FM_TAG,
  CONJUNCTION as FM_CONJUNCTION,
  OPEN_BRACKET as FM_OPEN_BRACKET,
  CLOSE_BRACKET as FM_CLOSE_BRACKET
} from 'in-new-components/QueryBuilder/transformation/formModel';
import {
  toBackendQueryModel,
  EXPRESSION,
  OPERATOR_AND,
  OPERATOR_OR
} from 'in-new-components/QueryBuilder/transformation/backendQueryModel';

describe('in-new-components/QueryBuilder/transformation/backendQueryModel', () => {
  describe('#toBackendQueryModel', () => {
    const emptyTagFilter = {
      type: EXPRESSION,
      logicalOperator: OPERATOR_OR,
      elements: []
    };

    it('should map null or undefined form model to an empty tag filter expression element', () => {
      expect(toBackendQueryModel(null)).to.deep.equal(emptyTagFilter);
      expect(toBackendQueryModel(undefined)).to.deep.equal(emptyTagFilter);
    });

    it('should map an empty form model to an empty tag filter expression element', () => {
      expect(toBackendQueryModel([])).to.deep.equal(emptyTagFilter);
    });

    it('should map a single tag filter into a single tag filter', () => {
      const tagFilter = {
        type: FM_TAG,
        name: 'service.name',
        operator: 'EQUALS',
        value: 'shop',
        entity: 'DESTINATION',
        key: undefined
      };
      expect(
        toBackendQueryModel([{ ...tagFilter, otherPropertyWhichIsOnlyPartOfTheFormModel: 'foobar' }])
      ).to.deep.equal(tagFilter);
    });

    it('should map multiple tag filters according to their type', () => {
      const tagFilters = [
        {
          type: FM_OPEN_BRACKET
        },
        {
          type: FM_TAG,
          name: 'service.name',
          operator: 'EQUALS',
          value: 'shop',
          entity: 'DESTINATION',
          key: undefined
        },
        {
          type: FM_CONJUNCTION,
          logicalOperator: OPERATOR_OR
        },
        {
          type: FM_TAG,
          name: 'service.name',
          operator: 'EQUALS',
          value: 'shipping',
          entity: 'DESTINATION',
          key: undefined
        },
        {
          type: FM_CONJUNCTION,
          logicalOperator: OPERATOR_OR
        },
        {
          type: FM_TAG,
          name: 'service.name',
          operator: 'EQUALS',
          value: 'product',
          entity: 'SOURCE'
        },
        {
          type: FM_CLOSE_BRACKET
        }
      ];
      expect(toBackendQueryModel(tagFilters)).to.deep.equal({
        type: EXPRESSION,
        logicalOperator: OPERATOR_OR,
        elements: [
          {
            type: FM_TAG,
            name: 'service.name',
            operator: 'EQUALS',
            value: 'shop',
            entity: 'DESTINATION',
            key: undefined
          },
          {
            type: FM_TAG,
            name: 'service.name',
            operator: 'EQUALS',
            value: 'shipping',
            entity: 'DESTINATION',
            key: undefined
          },
          {
            type: FM_TAG,
            name: 'service.name',
            operator: 'EQUALS',
            value: 'product',
            entity: 'SOURCE'
          }
        ]
      });
    });

    it('should map multiple tag filter expressions', () => {
      const tagFilters = [
        {
          type: FM_OPEN_BRACKET
        },
        {
          type: FM_TAG,
          name: 'key',
          operator: 'EQUALS',
          value: 'A',
          entity: 'DESTINATION',
          key: undefined
        },
        {
          type: FM_CONJUNCTION,
          logicalOperator: OPERATOR_OR
        },
        {
          type: FM_OPEN_BRACKET
        },
        {
          type: FM_TAG,
          name: 'key',
          operator: 'EQUALS',
          value: 'B',
          entity: 'DESTINATION',
          key: undefined
        },
        {
          type: FM_CONJUNCTION,
          logicalOperator: OPERATOR_AND
        },
        {
          type: FM_TAG,
          name: 'key',
          operator: 'EQUALS',
          value: 'C',
          entity: 'DESTINATION',
          key: undefined
        },
        {
          type: FM_CLOSE_BRACKET
        },
        {
          type: FM_CLOSE_BRACKET
        }
      ];
      expect(toBackendQueryModel(tagFilters)).to.deep.equal({
        type: EXPRESSION,
        logicalOperator: OPERATOR_OR,
        elements: [
          {
            type: FM_TAG,
            name: 'key',
            operator: 'EQUALS',
            value: 'A',
            entity: 'DESTINATION',
            key: undefined
          },
          {
            type: EXPRESSION,
            logicalOperator: OPERATOR_AND,
            elements: [
              {
                type: FM_TAG,
                name: 'key',
                operator: 'EQUALS',
                value: 'B',
                entity: 'DESTINATION',
                key: undefined
              },
              {
                type: FM_TAG,
                name: 'key',
                operator: 'EQUALS',
                value: 'C',
                entity: 'DESTINATION',
                key: undefined
              }
            ]
          }
        ]
      });
    });
  });
});
