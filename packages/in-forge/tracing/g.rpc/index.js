/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import { registerSpanDefinition } from 'in-sdk/tracing';
import { getLabel } from 'in-forge/tracing/rpc/spanDefinition';

registerSpanDefinition({
  type: 'g.rpc',
  category: 'rpc',

  typeName: {
    singular: t('in-forge:tracing.grpc.indexName'),
    plural: t('in-forge:tracing.grpc.indexName_plural')
  },

  detailView: 'GolangRpcServerSpanDetailView',

  getLabel
});
