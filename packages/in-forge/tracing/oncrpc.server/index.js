/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getLabel } from 'in-forge/tracing/rpc/spanDefinition';
import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'oncrpc.server',
  category: 'rpc',

  typeName: {
    singular: t('in-forge:tracing.oncrpcServer.indexName', { count: 1 }),
    plural: t('in-forge:tracing.oncrpcServer.indexName', { count: 2 })
  },

  detailView: 'OncRpcServerDetailView',

  getLabel
});
