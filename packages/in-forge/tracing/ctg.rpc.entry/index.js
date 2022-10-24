/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import { getLabel } from 'in-forge/tracing/rpc/spanDefinition';
import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'ctg.rpc.entry',
  category: t('in-forge:tracingCategory.rpc'),

  detailView: 'CtgRpcEntryDetailView',

  getLabel
});
