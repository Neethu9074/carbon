/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { getLabel } from 'in-forge/tracing/rpc/spanDefinition';
import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'cics.rpc.entry',
  category: t('in-forge:tracingCategory.rpc', 'rpc'),

  detailView: 'CicsRpcEntryDetailView',

  getLabel
});
