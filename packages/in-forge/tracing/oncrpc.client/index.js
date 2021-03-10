/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import { getLabel } from 'in-forge/tracing/rpc/spanDefinition';
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'oncrpc.client',
  category: 'rpc',

  typeName: {
    singular: t('in-forge:tracing.oncrpcClient.indexName', { count: 1 }),
    plural: t('in-forge:tracing.oncrpcClient.indexName', { count: 2 })
  },

  detailView: 'OncRpcClientDetailView',

  getLabel
});
