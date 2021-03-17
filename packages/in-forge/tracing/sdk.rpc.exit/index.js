/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getLabel } from 'in-forge/tracing/rpc/spanDefinition';
import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'sdk.rpc.exit',
  category: t('in-forge:tracingCategory.rpc', 'rpc'),

  detailView: 'RpcClientDetailView',

  getLabel
});
