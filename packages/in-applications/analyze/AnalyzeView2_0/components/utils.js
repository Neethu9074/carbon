/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { traceIdFilterOverrideEnabled } from 'in-services/featureFlags';

export function getServerity({ item, dataSource }) {
  if (dataSource === 'traces') {
    return item.trace.erroneous ? 10 : 0;
  }
  return item.call.errorCount >= 1 ? 10 : 0;
}

export function applyTraceIdFilter(formModel, traceId) {
  const traceIdFilterExpression = [tagFilter('trace.id', EQUALS, traceId)];

  if (traceIdFilterOverrideEnabled) {
    return traceIdFilterExpression;
  }

  const shortTraceId = traceId.slice(-16);
  const hasTraceIdFilter = formModel.some(
    tagFilter =>
      tagFilter.name === 'trace.id' && tagFilter.operator === EQUALS && tagFilter.value?.endsWith(shortTraceId)
  );
  if (hasTraceIdFilter) {
    return formModel;
  }

  return joinExpressions({ expressions: [formModel, traceIdFilterExpression] });
}
