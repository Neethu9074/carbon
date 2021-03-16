/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'camel',
  category: 'messaging',

  typeName: {
    singular: t('in-forge:tracing.camel.indexName'),
    plural: t('in-forge:tracing.camel.indexName_plural')
  },

  detailView: 'CamelSpanDetailView',

  getLabel(span) {
    return 'Type ' + span.getIn(['data', 'camel', 'type']);
  }
});
