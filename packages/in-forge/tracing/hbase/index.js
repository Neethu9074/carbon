/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'hbase',
  category: 'database',

  typeName: {
    singular: t('in-forge:tracing.hbase.indexName'),
    plural: t('in-forge:tracing.hbase.indexName_plural')
  },

  detailView: 'HbaseSpanDetailView'
});
