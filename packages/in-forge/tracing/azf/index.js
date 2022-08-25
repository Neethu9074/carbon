/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
// we do not define a category since Azure Functions entries can belong to different categories depending on the trigger - they
// can be HTTP entries, or messaging entries, or event entries or batch entries.
  type: 'azf',
  detailView: 'AzureFunctionsSpanDetailView',

  getLabel(span) {
    const functionName = span.getIn(['data', 'azf', 'methodname']);
    if (functionName) {
      return functionName;
    }
    return null;
  }
});
