/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'hz',
  category: 'database',

  typeName: {
    singular: t('in-forge:tracing.hz.indexName'),
    plural: t('in-forge:tracing.hz.indexName_plural')
  },

  detailView: 'HzSpanDetailView'
});
