/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env mocha */

import { expect } from 'chai';

import {
  toBackendQueryModel,
  addTagFilters,
  containsTagName,
  EXPRESSION,
  OPERATOR_AND,
  OPERATOR_OR,
  OPERATOR_NOT
} from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import {
  TAG as FM_TAG,
  CONJUNCTION as FM_CONJUNCTION,
  OPEN_BRACKET as FM_OPEN_BRACKET,
  CLOSE_BRACKET as FM_CLOSE_BRACKET
} from 'in-new-components/QueryBuilder/transformation/formModel';
import { type as TAG_FILTER } from 'in-new-components/QueryBuilder/transformation/tagFilter';

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

    it('should map a form model with empty brackets to an empty tag filter expression element', () => {
      expect(toBackendQueryModel([{ type: FM_OPEN_BRACKET }, { type: FM_CLOSE_BRACKET }])).to.deep.equal(
        emptyTagFilter
      );
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

    it('should map a single negated tag filter', () => {
      expect(
        toBackendQueryModel([
          {
            type: FM_CONJUNCTION,
            logicalOperator: OPERATOR_NOT
          },
          {
            type: FM_TAG,
            name: 'service.name',
            operator: 'EQUALS',
            value: 'shop',
            entity: 'DESTINATION',
            key: undefined
          }
        ])
      ).to.deep.equal({
        elements: [
          {
            entity: 'DESTINATION',
            key: undefined,
            name: 'service.name',
            operator: 'EQUALS',
            type: TAG_FILTER,
            value: 'shop'
          }
        ],
        logicalOperator: 'NOT',
        type: 'EXPRESSION'
      });
    });

    it('should map two tag filters joined with a conjunction: OR', () => {
      const tagFilters = [
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
          }
        ]
      });
    });

    it('should map two tag filters joined with a conjunction: AND', () => {
      const tagFilters = [
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
          logicalOperator: OPERATOR_AND
        },
        {
          type: FM_TAG,
          name: 'service.name',
          operator: 'EQUALS',
          value: 'shipping',
          entity: 'DESTINATION',
          key: undefined
        }
      ];
      expect(toBackendQueryModel(tagFilters)).to.deep.equal({
        type: EXPRESSION,
        logicalOperator: OPERATOR_AND,
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
          }
        ]
      });
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
          type: FM_TAG,
          name: 'key',
          operator: 'EQUALS',
          value: 'A',
          entity: 'DESTINATION',
          key: undefined
        },
        {
          type: FM_CONJUNCTION,
          logicalOperator: OPERATOR_AND
        },
        {
          type: FM_CONJUNCTION,
          logicalOperator: OPERATOR_NOT
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
          type: FM_CONJUNCTION,
          logicalOperator: OPERATOR_OR
        },
        {
          type: FM_TAG,
          name: 'key',
          operator: 'EQUALS',
          value: 'D',
          entity: 'DESTINATION',
          key: undefined
        },
        {
          type: FM_CLOSE_BRACKET
        }
      ];
      expect(toBackendQueryModel(tagFilters)).to.deep.equal({
        type: 'EXPRESSION',
        logicalOperator: 'AND',
        elements: [
          {
            type: TAG_FILTER,
            name: 'key',
            key: undefined,
            value: 'A',
            operator: 'EQUALS',
            entity: 'DESTINATION'
          },
          {
            type: 'EXPRESSION',
            logicalOperator: 'NOT',
            elements: [
              {
                type: 'EXPRESSION',
                logicalOperator: 'OR',
                elements: [
                  {
                    type: 'EXPRESSION',
                    logicalOperator: 'AND',
                    elements: [
                      {
                        type: TAG_FILTER,
                        name: 'key',
                        key: undefined,
                        value: 'B',
                        operator: 'EQUALS',
                        entity: 'DESTINATION'
                      },
                      {
                        type: TAG_FILTER,
                        name: 'key',
                        key: undefined,
                        value: 'C',
                        operator: 'EQUALS',
                        entity: 'DESTINATION'
                      }
                    ]
                  },
                  {
                    type: TAG_FILTER,
                    name: 'key',
                    key: undefined,
                    value: 'D',
                    operator: 'EQUALS',
                    entity: 'DESTINATION'
                  }
                ]
              }
            ]
          }
        ]
      });
    });

    it('should map: A or B and C', () => {
      const tagFilters = [
        {
          type: FM_TAG,
          name: 'name',
          operator: 'EQUALS',
          value: 'a'
        },
        {
          type: FM_CONJUNCTION,
          logicalOperator: OPERATOR_OR
        },
        {
          type: FM_TAG,
          name: 'name',
          operator: 'EQUALS',
          value: 'b'
        },
        {
          type: FM_CONJUNCTION,
          logicalOperator: OPERATOR_AND
        },
        {
          type: FM_TAG,
          name: 'name',
          operator: 'EQUALS',
          value: 'c'
        }
      ];
      expect(toBackendQueryModel(tagFilters)).to.deep.equal({
        type: 'EXPRESSION',
        logicalOperator: 'OR',
        elements: [
          {
            type: TAG_FILTER,
            name: 'name',
            value: 'a',
            operator: 'EQUALS'
          },
          {
            type: 'EXPRESSION',
            logicalOperator: 'AND',
            elements: [
              {
                type: TAG_FILTER,
                name: 'name',
                value: 'b',
                operator: 'EQUALS'
              },
              {
                type: TAG_FILTER,
                name: 'name',
                value: 'c',
                operator: 'EQUALS'
              }
            ]
          }
        ]
      });
    });

    it('should handle multiple enclosing brackets', () => {
      expect(
        toBackendQueryModel([
          {
            type: FM_OPEN_BRACKET
          },
          {
            type: FM_OPEN_BRACKET
          },
          {
            type: FM_TAG,
            name: 'name',
            operator: 'EQUALS',
            value: 'a'
          },
          {
            type: FM_CONJUNCTION,
            logicalOperator: OPERATOR_AND
          },
          {
            type: FM_TAG,
            name: 'name',
            operator: 'EQUALS',
            value: 'b'
          },
          {
            type: FM_CLOSE_BRACKET
          },
          {
            type: FM_CONJUNCTION,
            logicalOperator: OPERATOR_AND
          },
          {
            type: FM_TAG,
            name: 'name',
            operator: 'EQUALS',
            value: 'c'
          },
          {
            type: FM_CLOSE_BRACKET
          }
        ])
      ).to.deep.equal({
        type: 'EXPRESSION',
        logicalOperator: 'AND',
        elements: [
          {
            type: 'EXPRESSION',
            logicalOperator: 'AND',
            elements: [
              {
                type: TAG_FILTER,
                name: 'name',
                value: 'a',
                operator: 'EQUALS'
              },
              {
                type: TAG_FILTER,
                name: 'name',
                value: 'b',
                operator: 'EQUALS'
              }
            ]
          },
          {
            type: TAG_FILTER,
            name: 'name',
            value: 'c',
            operator: 'EQUALS'
          }
        ]
      });
    });

    it('should add tag filters to tag filter', () => {
      expect(
        addTagFilters({ type: TAG_FILTER, name: 'name', value: 'a', operator: 'EQUALS' }, [
          { type: TAG_FILTER, name: 'name', value: 'b', operator: 'EQUALS' },
          { type: TAG_FILTER, name: 'name', value: 'c', operator: 'EQUALS' }
        ])
      ).to.deep.equals({
        type: 'EXPRESSION',
        logicalOperator: 'AND',
        elements: [
          { type: TAG_FILTER, name: 'name', value: 'a', operator: 'EQUALS' },
          { type: TAG_FILTER, name: 'name', value: 'b', operator: 'EQUALS' },
          { type: TAG_FILTER, name: 'name', value: 'c', operator: 'EQUALS' }
        ]
      });
    });

    it('should add tag filters to expression', () => {
      expect(
        addTagFilters(
          {
            type: 'EXPRESSION',
            logicalOperator: 'OR',
            elements: [
              { type: TAG_FILTER, name: 'name', value: 'a', operator: 'EQUALS' },
              { type: TAG_FILTER, name: 'name', value: 'b', operator: 'EQUALS' }
            ]
          },
          [{ type: TAG_FILTER, name: 'name', value: 'c', operator: 'EQUALS' }],
          OPERATOR_OR
        )
      ).to.deep.equals({
        type: 'EXPRESSION',
        logicalOperator: 'OR',
        elements: [
          {
            type: 'EXPRESSION',
            logicalOperator: 'OR',
            elements: [
              { type: TAG_FILTER, name: 'name', value: 'a', operator: 'EQUALS' },
              { type: TAG_FILTER, name: 'name', value: 'b', operator: 'EQUALS' }
            ]
          },
          { type: TAG_FILTER, name: 'name', value: 'c', operator: 'EQUALS' }
        ]
      });
    });

    it('should add single tag filter to empty expression as bare tag filter', () => {
      expect(
        addTagFilters(
          {
            type: 'EXPRESSION',
            logicalOperator: 'OR',
            elements: []
          },
          [{ type: TAG_FILTER, name: 'name', value: 'c', operator: 'EQUALS' }]
        )
      ).to.deep.equals({ type: TAG_FILTER, name: 'name', value: 'c', operator: 'EQUALS' });
    });

    it('should drop empty expression when adding multiple filters', () => {
      expect(
        addTagFilters(
          {
            type: 'EXPRESSION',
            logicalOperator: 'OR',
            elements: []
          },
          [
            { type: TAG_FILTER, name: 'name', value: 'c', operator: 'EQUALS' },
            { type: TAG_FILTER, name: 'name', value: 'd', operator: 'EQUALS' }
          ]
        )
      ).to.deep.equals({
        type: 'EXPRESSION',
        logicalOperator: 'AND',
        elements: [
          { type: TAG_FILTER, name: 'name', value: 'c', operator: 'EQUALS' },
          { type: TAG_FILTER, name: 'name', value: 'd', operator: 'EQUALS' }
        ]
      });
    });
  });

  describe('#containsTagName', () => {
    const tagName = 'service.name';
    const emptyTagFilter = {
      type: EXPRESSION,
      logicalOperator: OPERATOR_AND,
      elements: []
    };

    it('should handle undefined or empty expression and return false', () => {
      expect(containsTagName(null, tagName)).to.equal(false);
      expect(containsTagName(undefined, tagName)).to.equal(false);
      expect(containsTagName(emptyTagFilter, tagName)).to.equal(false);
    });

    it('should handle single tag filter', () => {
      expect(
        containsTagName(
          {
            type: TAG_FILTER,
            name: tagName,
            operator: 'EQUALS',
            value: 'value'
          },
          tagName
        )
      ).to.equal(true);
      expect(
        containsTagName(
          {
            type: TAG_FILTER,
            name: 'other.tag',
            operator: 'EQUALS',
            value: 'value'
          },
          tagName
        )
      ).to.equal(false);
    });

    it('should handle simple expression', () => {
      expect(
        containsTagName(
          {
            type: 'EXPRESSION',
            logicalOperator: 'AND',
            elements: [
              { type: TAG_FILTER, name: tagName, value: 'value', operator: 'EQUALS' },
              { type: TAG_FILTER, name: 'other.tag', value: 'value', operator: 'EQUALS' }
            ]
          },
          tagName
        )
      ).to.equal(true);
      expect(
        containsTagName(
          {
            type: 'EXPRESSION',
            logicalOperator: 'OR',
            elements: [
              { type: TAG_FILTER, name: 'other.tag', value: 'value', operator: 'EQUALS' },
              { type: TAG_FILTER, name: 'another.tag', value: 'value', operator: 'EQUALS' }
            ]
          },
          tagName
        )
      ).to.equal(false);
    });

    it('should handle nested expression', () => {
      expect(
        containsTagName(
          {
            type: 'EXPRESSION',
            logicalOperator: 'AND',
            elements: [
              { type: TAG_FILTER, name: 'other.tag', value: 'value', operator: 'EQUALS' },
              {
                type: 'EXPRESSION',
                logicalOperator: 'AND',
                elements: [
                  { type: TAG_FILTER, name: 'another.tag', value: 'value', operator: 'EQUALS' },
                  { type: TAG_FILTER, name: tagName, value: 'value', operator: 'EQUALS' }
                ]
              }
            ]
          },
          tagName
        )
      ).to.equal(true);
      expect(
        containsTagName(
          {
            type: 'EXPRESSION',
            logicalOperator: 'OR',
            elements: [
              { type: TAG_FILTER, name: 'other.tag', value: 'value', operator: 'EQUALS' },
              {
                type: 'EXPRESSION',
                logicalOperator: 'AND',
                elements: [
                  { type: TAG_FILTER, name: 'another.tag', value: 'value', operator: 'EQUALS' },
                  { type: TAG_FILTER, name: 'just.another.tag', value: 'value', operator: 'EQUALS' }
                ]
              }
            ]
          },
          tagName
        )
      ).to.equal(false);
    });
  });
});
