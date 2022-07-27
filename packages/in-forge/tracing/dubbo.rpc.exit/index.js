/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import { getLabel } from 'in-forge/tracing/rpc/spanDefinition';
import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'dubbo.rpc.exit',
  category: t('in-forge:tracingCategory.rpc'),

  detailView: 'DubboRpcExitDetailView',

  getLabel
});
