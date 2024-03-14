/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Group, GroupByTag, Grouping, TagFilter, TagFilterExpressionElementUnion } from '@instana/types';

import {
  EMPTY_EXPRESSION,
  OPERATOR_OR,
  addTagFilters,
  createTagFilterExpression
} from 'in-components/QueryBuilder/transformation/backendQueryModel';
import {
  toGroupByTag,
  logsGroupbyTag,
  toUIGrouping,
  setBackendQueryModel
} from 'in-alerting/smart-alerts/logs/dialog/advanced/AlertConfigUtils';
import { tagFilter as queryTagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import { CONTAINS } from 'in-components/QueryBuilder/tagFilter/operators';

// GIVEN
const searchQuery = 'WARN';
const setFilterExpression = jest.fn();
const groupBy: Group[] = [
  {
    groupbyTag: 'log.streamName',
    groupbyTagEntity: NOT_APPLICABLE,
    groupbyTagSecondLevelKey: undefined
  }
];
const groupByTag: GroupByTag[] = [
  {
    tagName: 'log.streamName',
    key: undefined
  }
];

const tagFilter = [
  {
    value: '',
    operator: '',
    name: 'log.streamName',
    entity: NOT_APPLICABLE,
    type: 'TAG_FILTER',
    key: undefined
  }
];

const backendQueryModel: TagFilterExpressionElementUnion = {
  type: 'TAG_FILTER',
  name: 'log.streamName',
  operator: 'EQUALS',
  entity: NOT_APPLICABLE,
  value: 'ERROR'
};

describe('in-alerting/smart-alerts/logs/dialog/advanced/AlertConfigUtils', () => {
  describe('toGroupByTag', () => {
    it('returns undefined if groupby is empty', () => {
      const emptyArrayInput: Group[] = [];
      const expectedOutput: GroupByTag[] | undefined = undefined;
      expect(toGroupByTag(emptyArrayInput)).toEqual(expectedOutput);
    });

    it('returns valid GroupByTag', () => {
      expect(toGroupByTag(groupBy)).toEqual(groupByTag);
    });
  });

  describe('logsGroupbyTag', () => {
    it('returns undefined if groupby is empty', () => {
      const emptyArrayInput: GroupByTag[] = [];
      const expectedOutput: Group[] = [];
      expect(logsGroupbyTag(emptyArrayInput)).toEqual(expectedOutput);
    });

    it('returns valid Group[]', () => {
      expect(logsGroupbyTag(groupByTag)).toEqual(groupBy);
    });
  });

  describe('toUIGrouping', () => {
    it('returns undefined if groupby is empty', () => {
      const emptyArrayInput: Group[] = [];
      const expectedEmptyArrayOutput: Grouping[] = [];
      expect(toUIGrouping(emptyArrayInput)).toEqual(expectedEmptyArrayOutput);
    });

    it('returns undefined if groupby is empty', () => {
      expect(toUIGrouping(groupBy)).toEqual(tagFilter);
    });
  });

  describe('setBackendQueryModel', () => {
    it('Search query provided, no tagFilterExpression', () => {
      const backendQueryModel: TagFilterExpressionElementUnion = EMPTY_EXPRESSION;

      const searchFE = queryTagFilter(
        groupBy[0].groupbyTag,
        CONTAINS,
        searchQuery,
        groupBy[0]?.groupbyTagSecondLevelKey,
        NOT_APPLICABLE
      );

      setBackendQueryModel(groupBy, backendQueryModel, setFilterExpression, searchQuery);
      expect(setFilterExpression).toHaveBeenCalledWith(createTagFilterExpression(OPERATOR_OR, [searchFE]));
    });

    it('Search query provided, with tagFilterExpression', () => {
      const searchFE: TagFilter[] = groupBy.map(groupBy => {
        return queryTagFilter(
          groupBy.groupbyTag,
          CONTAINS,
          searchQuery,
          groupBy?.groupbyTagSecondLevelKey,
          NOT_APPLICABLE
        );
      });

      const expectedResult = addTagFilters(createTagFilterExpression(OPERATOR_OR, searchFE), [backendQueryModel]);

      setBackendQueryModel(groupBy, backendQueryModel, setFilterExpression, searchQuery);
      expect(setFilterExpression).toHaveBeenCalledWith(expectedResult);

      setBackendQueryModel(groupBy, backendQueryModel, setFilterExpression, '');
      expect(setFilterExpression).toHaveBeenCalledWith(expectedResult);
    });

    it('no Search query provided, with tagFilterExpression', () => {
      setBackendQueryModel(groupBy, backendQueryModel, setFilterExpression, '');
      expect(setFilterExpression).toHaveBeenCalledWith(backendQueryModel);
    });
  });
});
