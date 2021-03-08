/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'java.rmi.entry',
  category: 'rpc',

  typeName: {
    singular: t('in-forge:tracing.javaRmiEntry.indexName'),
    plural: t('in-forge:tracing.javaRmiEntry.indexName_plural')
  },

  detailView: 'RmiEntrySpanDetailView'
});
