/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'sdk.graphql',
  category: t('in-forge:tracingCategory.graphql', 'graphql'),

  detailView: 'GraphQlSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'graphql', 'operationName']);
  }
});
