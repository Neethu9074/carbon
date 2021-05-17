/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

/* eslint-env jest */

import { expect } from 'chai';

import { CLOSE_BRACKET, CONJUNCTION, OPEN_BRACKET } from 'in-new-components/QueryBuilder/transformation/formModel';
import { GREATER_OR_EQUAL_THAN, LESS_OR_EQUAL_THAN } from 'in-new-components/QueryBuilder/tagFilter/operators';
import { and, or } from 'in-new-components/QueryBuilder/ConjunctionSelectorOverlay/supportedSelections';
import { type as TAG_FILTER } from 'in-new-components/QueryBuilder/transformation/tagFilter';
import formModelFromHttpStatusRange, { TAG_CALL_HTTP_STATUS } from './formModelUtils';

export const EXP_OPEN_BRACKET = Object.freeze({ type: OPEN_BRACKET });
export const EXP_CLOSE_BRACKET = Object.freeze({ type: CLOSE_BRACKET });
export const EXP_AND_CONJUNCTION = Object.freeze({ type: CONJUNCTION, logicalOperator: and });
export const EXP_OR_CONJUNCTION = Object.freeze({ type: CONJUNCTION, logicalOperator: or });

describe('in-applications/analyze/utils/formModelUtils', () => {
  describe('#formModelFromHttpStatusRange()', () => {
    it('2xx, 3xx, 4xx, 5xx', () => {
      expect(formModelFromHttpStatusRange([2, 3, 4, 5])).to.deep.equal([
        { type: TAG_FILTER, name: TAG_CALL_HTTP_STATUS, value: 200, operator: GREATER_OR_EQUAL_THAN }
      ]);
    });

    it('1xx, 3xx, 5xx', () => {
      expect(formModelFromHttpStatusRange([1, 3, 5])).to.deep.equal([
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

    it('empty', () => {
      expect(formModelFromHttpStatusRange([])).to.deep.equal([]);
    });

    it('2xx, 3xx, 4xx', () => {
      expect(formModelFromHttpStatusRange([2, 3, 4])).to.deep.equal([
        { type: TAG_FILTER, name: TAG_CALL_HTTP_STATUS, value: 200, operator: GREATER_OR_EQUAL_THAN },
        EXP_AND_CONJUNCTION,
        { type: TAG_FILTER, name: TAG_CALL_HTTP_STATUS, value: 499, operator: LESS_OR_EQUAL_THAN }
      ]);
    });

    it('2xx', () => {
      expect(formModelFromHttpStatusRange([2])).to.deep.equal([
        { type: TAG_FILTER, name: TAG_CALL_HTTP_STATUS, value: 200, operator: GREATER_OR_EQUAL_THAN },
        EXP_AND_CONJUNCTION,
        { type: TAG_FILTER, name: TAG_CALL_HTTP_STATUS, value: 299, operator: LESS_OR_EQUAL_THAN }
      ]);
    });
  });
});
