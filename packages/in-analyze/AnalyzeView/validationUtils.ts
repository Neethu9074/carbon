/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';

function isValidTraceId(traceId: string) {
  // Instana native trace IDs are 16 chars long while OpenTelemetry trace IDs are 32 chars long
  return traceId?.length === 16 || traceId?.length === 32;
}

export function findInvalidTraceIdTagFilter(formModel: FormModelElement[], traceIdTagName: string) {
  return formModel?.find(
    tagFilter =>
      tagFilter.type === 'TAG_FILTER' &&
      tagFilter.name === traceIdTagName &&
      (tagFilter.operator === 'EQUALS' || tagFilter.operator === 'NOT_EQUAL') &&
      !isValidTraceId(tagFilter.value)
  );
}
