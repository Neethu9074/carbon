/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'gcpsa',
  category: 'generic',

  typeName: {
    singular: t('in-forge:tracing.gcpsa.indexName'),
    plural: t('in-forge:tracing.gcpsa.indexName_plural')
  },

  detailView: 'GCPSASpanDetailView',

  getLabel(span) {
    return ['op', 'snap', 'sub', 'top']
      .map(key => span.getIn(['data', 'gcpsa', key]))
      .filter(tag => tag)
      .join(' ');
  }
});
