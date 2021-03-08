/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import { registerSpanDefinition } from 'in-sdk/tracing';

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
