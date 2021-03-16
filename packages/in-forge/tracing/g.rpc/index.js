/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getLabel } from 'in-forge/tracing/rpc/spanDefinition';
import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

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
