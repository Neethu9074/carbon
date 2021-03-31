/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'java.rmi.entry',
  category: t('in-forge:tracingCategory.rpc'),

  detailView: 'RmiEntrySpanDetailView'
});
