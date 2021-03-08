/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'gcps',
  category: 'messaging',

  typeName: {
    singular: t('in-forge:tracing.gcps.indexName'),
    plural: t('in-forge:tracing.gcps.indexName_plural')
  },

  detailView: 'GCPSSpanDetailView',

  getLabel(span) {
    return ['op', 'sub', 'top']
      .map(key => span.getIn(['data', 'gcps', key]))
      .filter(tag => tag)
      .join(' ');
  }
});
