/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'hornetq',
  category: 'messaging',

  typeName: {
    singular: t('in-forge:tracing.hornetq.indexName'),
    plural: t('in-forge:tracing.hornetq.indexName_plural')
  },

  detailView: 'HornetQSpanDetailView',

  getLabel(span) {
    const label = span.getIn(['data', 'hornetq', 'type'], '<unknown>');
    return 'HornetQ ' + label;
  }
});
