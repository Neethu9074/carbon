/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { TagFilterExpressionElementUnion, isTagFilterExpression, isTagFilter } from 'in-types';
import { OPERATOR_OR } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';

export const analyzeTagFilterExpression = (
  backendQueryModel: TagFilterExpressionElementUnion,
  selectedTrace: string
): boolean => {
  if (isTagFilterExpression(backendQueryModel)) {
    if (backendQueryModel.elements.length > 0) {
      let hasTraceIdInLeftSideExp: boolean = analyzeTagFilterExpression(backendQueryModel.elements[0], selectedTrace);
      let hasTraceIdInRightSideExp: boolean = analyzeTagFilterExpression(backendQueryModel.elements[1], selectedTrace);
      if (backendQueryModel.logicalOperator === OPERATOR_OR) {
        return hasTraceIdInLeftSideExp && hasTraceIdInRightSideExp;
      } else {
        return hasTraceIdInLeftSideExp || hasTraceIdInRightSideExp;
      }
    }
    return false;
  } else {
    return hasTraceIdFilter(backendQueryModel, selectedTrace);
  }
};

const hasTraceIdFilter = (element: TagFilterExpressionElementUnion, selectedTrace: string) => {
  const shortTraceId = selectedTrace.slice(-16);
  return (
    isTagFilter(element) &&
    element.name === 'trace.id' &&
    element.operator === EQUALS &&
    element.value?.endsWith(shortTraceId)
  );
};
