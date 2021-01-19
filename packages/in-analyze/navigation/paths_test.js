/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
/* eslint-env mocha */
import { expect } from 'chai';

import {
  CONTAINS,
  ENDS_WITH,
  EQUALS,
  GREATER_OR_EQUAL_THAN,
  GREATER_THAN,
  IS_EMPTY,
  LESS_OR_EQUAL_THAN,
  LESS_THAN,
  NOT_EMPTY,
  NOT_EQUAL,
  NOT_STARTS_WITH,
  STARTS_WITH
} from 'in-new-components/QueryBuilder/tagFilter/operators';
import { CLOSE_BRACKET, CONJUNCTION, OPEN_BRACKET } from 'in-new-components/QueryBuilder/transformation/formModel';
import { httpStatusCodeTagFiltersToExpression, TAG_CALL_HTTP_STATUS } from 'in-analyze/navigation/paths';
import { type as TAG_FILTER } from 'in-new-components/QueryBuilder/transformation/tagFilter';

export const EXP_OPEN_BRACKET = Object.freeze({ type: OPEN_BRACKET });
export const EXP_CLOSE_BRACKET = Object.freeze({ type: CLOSE_BRACKET });
export const EXP_AND_CONJUNCTION = Object.freeze({ type: CONJUNCTION, logicalOperator: 'AND' });
export const EXP_OR_CONJUNCTION = Object.freeze({ type: CONJUNCTION, logicalOperator: 'OR' });

describe('in-analyze/navigation/paths', () => {
  describe('#httpStatusCodeTagFiltersToExpression()', () => {
    it('not 1xx', () => {
      expect(
        httpStatusCodeTagFiltersToExpression([{ name: TAG_CALL_HTTP_STATUS, value: 1, operator: NOT_STARTS_WITH }])
      ).to.deep.equal([{ type: TAG_FILTER, name: TAG_CALL_HTTP_STATUS, value: 200, operator: GREATER_OR_EQUAL_THAN }]);
    });

    it('not 2xx, 4xx', () => {
      expect(
        httpStatusCodeTagFiltersToExpression([
          { name: TAG_CALL_HTTP_STATUS, value: 2, operator: NOT_STARTS_WITH },
          { name: TAG_CALL_HTTP_STATUS, value: 4, operator: NOT_STARTS_WITH }
        ])
      ).to.deep.equal([
        EXP_OPEN_BRACKET,
        { type: TAG_FILTER, name: TAG_CALL_HTTP_STATUS, value: 199, operator: LESS_OR_EQUAL_THAN },
        EXP_OR_CONJUNCTION,
        { type: TAG_FILTER, name: TAG_CALL_HTTP_STATUS, value: 300, operator: GREATER_OR_EQUAL_THAN },
        EXP_AND_CONJUNCTION,
        { type: TAG_FILTER, name: TAG_CALL_HTTP_STATUS, value: 399, operator: LESS_OR_EQUAL_THAN },
        EXP_CLOSE_BRACKET,
        EXP_OR_CONJUNCTION,
        { type: TAG_FILTER, name: TAG_CALL_HTTP_STATUS, value: 500, operator: GREATER_OR_EQUAL_THAN }
      ]);
    });

    it('not 1xx, 2xx, 3xx, 4xx, 5xx', () => {
      expect(
        httpStatusCodeTagFiltersToExpression([
          { name: TAG_CALL_HTTP_STATUS, value: 1, operator: NOT_STARTS_WITH },
          { name: TAG_CALL_HTTP_STATUS, value: 2, operator: NOT_STARTS_WITH },
          { name: TAG_CALL_HTTP_STATUS, value: 3, operator: NOT_STARTS_WITH },
          { name: TAG_CALL_HTTP_STATUS, value: 4, operator: NOT_STARTS_WITH },
          { name: TAG_CALL_HTTP_STATUS, value: 5, operator: NOT_STARTS_WITH }
        ])
      ).to.deep.equal([]);
    });

    it('not 1xx, 5xx', () => {
      expect(
        httpStatusCodeTagFiltersToExpression([
          { name: TAG_CALL_HTTP_STATUS, value: 1, operator: NOT_STARTS_WITH },
          { name: TAG_CALL_HTTP_STATUS, value: 5, operator: NOT_STARTS_WITH }
        ])
      ).to.deep.equal([
        { type: TAG_FILTER, name: TAG_CALL_HTTP_STATUS, value: 200, operator: GREATER_OR_EQUAL_THAN },
        EXP_AND_CONJUNCTION,
        { type: TAG_FILTER, name: TAG_CALL_HTTP_STATUS, value: 499, operator: LESS_OR_EQUAL_THAN }
      ]);
    });

    it('not 1xx, 3xx, 4xx, 5xx and not empty', () => {
      expect(
        httpStatusCodeTagFiltersToExpression([
          { name: TAG_CALL_HTTP_STATUS, value: 1, operator: NOT_STARTS_WITH },
          { name: TAG_CALL_HTTP_STATUS, value: 3, operator: NOT_STARTS_WITH },
          { name: TAG_CALL_HTTP_STATUS, value: 4, operator: NOT_STARTS_WITH },
          { name: TAG_CALL_HTTP_STATUS, value: 5, operator: NOT_STARTS_WITH },
          { name: TAG_CALL_HTTP_STATUS, operator: NOT_EMPTY }
        ])
      ).to.deep.equal([
        { type: TAG_FILTER, name: TAG_CALL_HTTP_STATUS, operator: NOT_EMPTY, key: undefined, value: undefined },
        EXP_AND_CONJUNCTION,
        { type: TAG_FILTER, name: TAG_CALL_HTTP_STATUS, value: 200, operator: GREATER_OR_EQUAL_THAN },
        EXP_AND_CONJUNCTION,
        { type: TAG_FILTER, name: TAG_CALL_HTTP_STATUS, value: 299, operator: LESS_OR_EQUAL_THAN }
      ]);
    });

    it('EQUALS, NOT_EQUAL, LESS_THAN, GREATER_THAN, GREATER_OR_EQUAL_THAN, LESS_OR_EQUAL_THAN', () => {
      expect(
        httpStatusCodeTagFiltersToExpression([
          { name: TAG_CALL_HTTP_STATUS, value: 100, operator: EQUALS },
          { name: TAG_CALL_HTTP_STATUS, value: 200, operator: NOT_EQUAL },
          { name: TAG_CALL_HTTP_STATUS, value: 300, operator: LESS_THAN },
          { name: TAG_CALL_HTTP_STATUS, value: 400, operator: GREATER_THAN },
          { name: TAG_CALL_HTTP_STATUS, value: 500, operator: GREATER_OR_EQUAL_THAN },
          { name: TAG_CALL_HTTP_STATUS, value: 599, operator: LESS_OR_EQUAL_THAN }
        ])
      ).to.deep.equal([
        { type: TAG_FILTER, name: TAG_CALL_HTTP_STATUS, value: 100, operator: EQUALS, key: undefined },
        EXP_AND_CONJUNCTION,
        { type: TAG_FILTER, name: TAG_CALL_HTTP_STATUS, value: 200, operator: NOT_EQUAL, key: undefined },
        EXP_AND_CONJUNCTION,
        { type: TAG_FILTER, name: TAG_CALL_HTTP_STATUS, value: 300, operator: LESS_THAN, key: undefined },
        EXP_AND_CONJUNCTION,
        { type: TAG_FILTER, name: TAG_CALL_HTTP_STATUS, value: 400, operator: GREATER_THAN, key: undefined },
        EXP_AND_CONJUNCTION,
        { type: TAG_FILTER, name: TAG_CALL_HTTP_STATUS, value: 500, operator: GREATER_OR_EQUAL_THAN, key: undefined },
        EXP_AND_CONJUNCTION,
        { type: TAG_FILTER, name: TAG_CALL_HTTP_STATUS, value: 599, operator: LESS_OR_EQUAL_THAN, key: undefined }
      ]);
    });

    it('2xx', () => {
      expect(
        httpStatusCodeTagFiltersToExpression([{ name: TAG_CALL_HTTP_STATUS, value: 2, operator: STARTS_WITH }])
      ).to.deep.equal([
        { type: TAG_FILTER, name: TAG_CALL_HTTP_STATUS, value: 200, operator: GREATER_OR_EQUAL_THAN },
        EXP_AND_CONJUNCTION,
        { type: TAG_FILTER, name: TAG_CALL_HTTP_STATUS, value: 299, operator: LESS_OR_EQUAL_THAN }
      ]);
    });

    it('equal foobar', () => {
      expect(
        httpStatusCodeTagFiltersToExpression([{ name: TAG_CALL_HTTP_STATUS, value: 'foobar', operator: EQUALS }])
      ).to.deep.equal([]);
    });

    it('not empty', () => {
      expect(
        httpStatusCodeTagFiltersToExpression([{ name: TAG_CALL_HTTP_STATUS, operator: NOT_EMPTY }])
      ).to.deep.equal([
        { type: TAG_FILTER, name: TAG_CALL_HTTP_STATUS, operator: NOT_EMPTY, key: undefined, value: undefined }
      ]);
    });

    it('is empty', () => {
      expect(httpStatusCodeTagFiltersToExpression([{ name: TAG_CALL_HTTP_STATUS, operator: IS_EMPTY }])).to.deep.equal([
        { type: TAG_FILTER, name: TAG_CALL_HTTP_STATUS, operator: IS_EMPTY, key: undefined, value: undefined }
      ]);
    });

    it('unsupported', () => {
      expect(
        httpStatusCodeTagFiltersToExpression([
          { name: TAG_CALL_HTTP_STATUS, value: 1, operator: ENDS_WITH },
          { name: TAG_CALL_HTTP_STATUS, value: 2, operator: CONTAINS }
        ])
      ).to.deep.equal([]);
    });
  });
});
