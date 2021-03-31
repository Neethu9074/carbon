/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { getLabel } from 'in-forge/tracing/rpc/spanDefinition';
import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'cics.rpc.exit',
  category: t('in-forge:tracingCategory.rpc'),

  detailView: 'CicsRpcExitDetailView',

  getLabel
});
