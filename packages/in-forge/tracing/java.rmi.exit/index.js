/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'java.rmi.exit',
  category: 'rpc',

  typeName: {
    singular: t('in-forge:tracing.javaRmiExit.indexName'),
    plural: t('in-forge:tracing.javaRmiExit.indexName_plural')
  },

  detailView: 'RmiExitSpanDetailView'
});
