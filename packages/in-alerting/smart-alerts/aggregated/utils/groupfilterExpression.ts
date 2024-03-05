/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { TagFilter } from '@instana/types';

import {
  OPERATOR_OR,
  addTagFilters,
  createTagFilterExpression
} from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import { CONTAINS } from 'in-components/QueryBuilder/tagFilter/operators';
import { TagFilterExpressionElementUnion } from 'in-types';

export function toUIGrouping(groupBy: string[]) {
  if (!groupBy.length) {
    return [];
  }
  const groupingFE: TagFilter[] = [];
  groupBy.forEach((groupName: string) => {
    groupingFE.push({
      value: '',
      //@ts-expect-error groupby doesnot have operator
      operator: '',
      name: groupName,
      entity: NOT_APPLICABLE,
      type: 'TAG_FILTER'
    });
  });
  return groupingFE;
}

/**
 * Sets the backend query model filter expression.
 * @param searchBy The table search by value.
 */
export function setBackendQueryModel(
  backendGroupBy: string[],
  backendQueryModel: TagFilterExpressionElementUnion,
  setFilterExpression: any,
  searchBy?: string,
  isInfraModel: boolean = false
) {
  if (searchBy) {
    const searchQuery = backendGroupBy.map((groupBy: string) => {
      if (isInfraModel) {
        groupBy = groupBy === 'dfq.type' ? 'dfq.selftype' : groupBy;
      }

      return tagFilter(groupBy, CONTAINS, searchBy, null, NOT_APPLICABLE);
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
