/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Group, GroupByTag, TagFilterExpressionElementUnion } from '@instana/types';

import {
  OPERATOR_OR,
  addTagFilters,
  createTagFilterExpression
} from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import { CONTAINS } from 'in-components/QueryBuilder/tagFilter/operators';

export function toGroupByTag(groupBy: Group[]): GroupByTag[] | undefined {
  if (!groupBy.length) {
    return undefined;
  }
  return groupBy.map(group => ({ tagName: group.groupbyTag, key: group?.groupbyTagSecondLevelKey ?? undefined }));
}

export const logsGroupbyTag = (groupBy: GroupByTag[]): Group[] => {
  return groupBy.map((tag: GroupByTag) => {
    return {
      groupbyTag: tag.tagName,
      groupbyTagEntity: 'NOT_APPLICABLE',
      groupbyTagSecondLevelKey: tag.key
    };
  });
};

export function toUIGrouping(groupBy: Group[]) {
  if (!groupBy.length) {
    return [];
  }
  const grouping = groupBy.map((tag: Group) => {
    return {
      value: '',
      operator: '',
      name: tag.groupbyTag,
      entity: NOT_APPLICABLE,
      type: 'TAG_FILTER',
      key: tag?.groupbyTagSecondLevelKey
    };
  });
  return grouping;
}

/**
 * Sets the backend query model filter expression.
 * @param searchBy The table search by value.
 */
export function setBackendQueryModel(
  backendGroupBy: Group[],
  backendQueryModel: TagFilterExpressionElementUnion,
  setFilterExpression: any,
  searchBy?: string
) {
  if (searchBy) {
    const searchQuery = backendGroupBy.map((groupBy: Group) => {
      return tagFilter(groupBy.groupbyTag, CONTAINS, searchBy, groupBy.groupbyTagSecondLevelKey, NOT_APPLICABLE);
    });

    if (backendQueryModel?.type === 'TAG_FILTER' || backendQueryModel?.elements?.length > 0) {
      const searchQueryModel = addTagFilters(createTagFilterExpression(OPERATOR_OR, searchQuery), [backendQueryModel]);

      setFilterExpression(searchQueryModel);
      return;
    } else {
      setFilterExpression(createTagFilterExpression(OPERATOR_OR, searchQuery));
      return;
    }
  }

  setFilterExpression(backendQueryModel);
}
