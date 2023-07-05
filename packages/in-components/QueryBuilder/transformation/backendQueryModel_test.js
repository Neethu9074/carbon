/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  toBackendQueryModel,
  addTagFilters,
  containsTagName,
  EXPRESSION,
  OPERATOR_AND,
  OPERATOR_OR,
  OPERATOR_NOT,
  isTagFilterExpression,
  isTagFilter,
  invert,
  createTagFilterExpression
} from 'in-components/QueryBuilder/transformation/backendQueryModel';
import {
  TAG as FM_TAG,
  CONJUNCTION as FM_CONJUNCTION,
  OPEN_BRACKET as FM_OPEN_BRACKET,
  CLOSE_BRACKET as FM_CLOSE_BRACKET
} from 'in-components/QueryBuilder/transformation/formModel';
import { tagFilter, type as TAG_FILTER } from 'in-components/QueryBuilder/transformation/tagFilter';

describe('in-components/QueryBuilder/transformation/backendQueryModel', () => {
  describe('#toBackendQueryModel', () => {
    const emptyTagFilter = {
      type: EXPRESSION,
      logicalOperator: OPERATOR_AND,
      elements: []
    };

    it('should map null or undefined form model to an empty tag filter expression element', () => {
      expect(toBackendQueryModel(null)).toStrictEqual(emptyTagFilter);
      expect(toBackendQueryModel(undefined)).toStrictEqual(emptyTagFilter);
    });

    it('should map an empty form model to an empty tag filter expression element', () => {
      expect(toBackendQueryModel([])).toStrictEqual(emptyTagFilter);
    });

    it('should map a form model with empty brackets to an empty tag filter expression element', () => {
      expect(toBackendQueryModel([{ type: FM_OPEN_BRACKET }, { type: FM_CLOSE_BRACKET }])).toStrictEqual(
        emptyTagFilter
      );
    });

    it('should map a single tag filter into a single tag filter', () => {
      const tagFilter = {
        type: FM_TAG,
        name: 'service.name',
        operator: 'EQUALS',
        value: 'shop',
        entity: 'DESTINATION'
      };
      expect(
        toBackendQueryModel([{ ...tagFilter, otherPropertyWhichIsOnlyPartOfTheFormModel: 'foobar' }])
      ).toStrictEqual(tagFilter);
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
      ).toStrictEqual({
        elements: [
          {
            entity: 'DESTINATION',
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
          entity: 'DESTINATION'
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
          entity: 'DESTINATION'
        }
      ];
      expect(toBackendQueryModel(tagFilters)).toStrictEqual({
        type: EXPRESSION,
        logicalOperator: OPERATOR_OR,
        elements: [
          {
            type: FM_TAG,
            name: 'service.name',
            operator: 'EQUALS',
            value: 'shop',
            entity: 'DESTINATION'
          },
          {
            type: FM_TAG,
            name: 'service.name',
            operator: 'EQUALS',
            value: 'shipping',
            entity: 'DESTINATION'
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
      expect(toBackendQueryModel(tagFilters)).toStrictEqual({
        type: EXPRESSION,
        logicalOperator: OPERATOR_AND,
        elements: [
          {
            type: FM_TAG,
            name: 'service.name',
            operator: 'EQUALS',
            value: 'shop',
            entity: 'DESTINATION'
          },
          {
            type: FM_TAG,
            name: 'service.name',
            operator: 'EQUALS',
            value: 'shipping',
            entity: 'DESTINATION'
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
          entity: 'DESTINATION'
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
          entity: 'DESTINATION'
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
      expect(toBackendQueryModel(tagFilters)).toStrictEqual({
        type: EXPRESSION,
        logicalOperator: OPERATOR_OR,
        elements: [
          {
            type: FM_TAG,
            name: 'service.name',
            operator: 'EQUALS',
            value: 'shop',
            entity: 'DESTINATION'
          },
          {
            type: FM_TAG,
            name: 'service.name',
            operator: 'EQUALS',
            value: 'shipping',
            entity: 'DESTINATION'
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
          entity: 'DESTINATION'
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
          entity: 'DESTINATION'
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
          entity: 'DESTINATION'
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
          entity: 'DESTINATION'
        },
        {
          type: FM_CLOSE_BRACKET
        }
      ];
      expect(toBackendQueryModel(tagFilters)).toStrictEqual({
        type: 'EXPRESSION',
        logicalOperator: 'AND',
        elements: [
          {
            type: TAG_FILTER,
            name: 'key',
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
                        value: 'B',
                        operator: 'EQUALS',
                        entity: 'DESTINATION'
                      },
                      {
                        type: TAG_FILTER,
                        name: 'key',
                        value: 'C',
                        operator: 'EQUALS',
                        entity: 'DESTINATION'
                      }
                    ]
                  },
                  {
                    type: TAG_FILTER,
                    name: 'key',
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
      expect(toBackendQueryModel(tagFilters)).toStrictEqual({
        type: 'EXPRESSION',
        logicalOperator: 'OR',
        elements: [
          {
            entity: 'NOT_APPLICABLE',
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
                entity: 'NOT_APPLICABLE',
                type: TAG_FILTER,
                name: 'name',
                value: 'b',
                operator: 'EQUALS'
              },
              {
                entity: 'NOT_APPLICABLE',
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
      ).toStrictEqual({
        type: 'EXPRESSION',
        logicalOperator: 'AND',
        elements: [
          {
            type: 'EXPRESSION',
            logicalOperator: 'AND',
            elements: [
              {
                entity: 'NOT_APPLICABLE',
                type: TAG_FILTER,
                name: 'name',
                value: 'a',
                operator: 'EQUALS'
              },
              {
                entity: 'NOT_APPLICABLE',
                type: TAG_FILTER,
                name: 'name',
                value: 'b',
                operator: 'EQUALS'
              }
            ]
          },
          {
            entity: 'NOT_APPLICABLE',
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
      ).toStrictEqual({
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
      ).toStrictEqual({
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
      ).toStrictEqual({ type: TAG_FILTER, name: 'name', value: 'c', operator: 'EQUALS' });
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
      ).toStrictEqual({
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
      expect(containsTagName(null, tagName)).toEqual(false);
      expect(containsTagName(undefined, tagName)).toEqual(false);
      expect(containsTagName(emptyTagFilter, tagName)).toEqual(false);
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
      ).toEqual(true);
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
      ).toEqual(false);
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
      ).toEqual(true);
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
      ).toEqual(false);
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
      ).toEqual(true);
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
      ).toEqual(false);
    });
  });

  describe('#isTagFilterExpression', () => {
    it('returns true for TagFilterExpression', () => {
      expect(
        isTagFilterExpression({
          type: EXPRESSION,
          logicalOperator: OPERATOR_AND,
          elements: []
        })
      ).toBeTruthy();
    });

    it('returns false for TagFilter', () => {
      expect(
        isTagFilterExpression({
          type: TAG_FILTER,
          name: 'abc',
          operator: 'EQUALS',
          value: 'value'
        })
      ).not.toBeTruthy();
    });
  });

  describe('#isTagFilter', () => {
    it('returns false for TagFilterExpression', () => {
      expect(
        isTagFilter({
          type: EXPRESSION,
          logicalOperator: OPERATOR_AND,
          elements: []
        })
      ).not.toBeTruthy();
    });

    it('returns true for TagFilter', () => {
      expect(
        isTagFilter({
          type: TAG_FILTER,
          name: 'abc',
          operator: 'EQUALS',
          value: 'value'
        })
      ).toBeTruthy();
    });
  });

  describe('#invert', () => {
    it.each([
      ['EQUALS', 'NOT_EQUAL'],
      ['CONTAINS', 'NOT_CONTAIN'],
      ['STARTS_WITH', 'NOT_STARTS_WITH'],
      ['ENDS_WITH', 'NOT_ENDS_WITH'],
      ['IS_BLANK', 'NOT_BLANK'],
      ['IS_EMPTY', 'NOT_EMPTY'],
      ['GREATER_OR_EQUAL_THAN', 'LESS_THAN'],
      ['GREATER_THAN', 'LESS_OR_EQUAL_THAN'],
      ['LESS_OR_EQUAL_THAN', 'GREATER_THAN'],
      ['LESS_THAN', 'GREATER_OR_EQUAL_THAN'],
      ['NOT_EQUAL', 'EQUALS'],
      ['NOT_CONTAIN', 'CONTAINS'],
      ['NOT_STARTS_WITH', 'STARTS_WITH'],
      ['NOT_ENDS_WITH', 'ENDS_WITH'],
      ['NOT_BLANK', 'IS_BLANK'],
      ['NOT_EMPTY', 'IS_EMPTY']
    ])('inverts a simple tagFilter with operator %s to %s', (operator, expectedOperator) => {
      // Given
      const filter = tagFilter('snacks.available', operator, 'IceCream', 'someKey', 'DESTINATION');

      // When
      const actualFilter = invert(filter);

      // Then
      expect(actualFilter).toEqual(
        tagFilter('snacks.available', expectedOperator, 'IceCream', 'someKey', 'DESTINATION')
      );
    });

    it.each([
      ['AND', 'OR'],
      ['OR', 'AND']
    ])('inverts a the logical operator %s of a tagFilterExpression to %s', (operator, expectedOperator) => {
      // Given
      const expression = createTagFilterExpression(operator, [
        tagFilter('snacks.available', 'GREATER_THAN', 0),
        tagFilter('snacks.type', 'EQUALS', 'IceCream')
      ]);

      // When
      const actual = invert(expression);

      // Then
      expect(actual).toEqual(expect.objectContaining({ logicalOperator: expectedOperator }));
    });

    it('correctly inverts a complex tagFilterExpression', () => {
      // Given
      const expression = createTagFilterExpression('AND', [
        tagFilter('snacks.available', 'GREATER_THAN', 0),
        createTagFilterExpression('OR', [
          tagFilter('snacks.type', 'EQUALS', 'Sorbet'),
          tagFilter('snacks.type', 'CONTAINS', 'Ice')
        ])
      ]);

      // When
      const actual = invert(expression);

      // Then
      expect(actual).toEqual(
        createTagFilterExpression('OR', [
          tagFilter('snacks.available', 'LESS_OR_EQUAL_THAN', 0),
          createTagFilterExpression('AND', [
            tagFilter('snacks.type', 'NOT_EQUAL', 'Sorbet'),
            tagFilter('snacks.type', 'NOT_CONTAIN', 'Ice')
          ])
        ])
      );
    });
  });
});
