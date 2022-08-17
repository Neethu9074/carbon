/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

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
