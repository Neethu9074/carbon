/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getLabel } from 'in-forge/tracing/http/spanDefinition';
import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'net-http',
  category: 'http',

  typeName: {
    singular: t('in-forge:tracing.netHttp.indexName', { count: 1 }),
    plural: t('in-forge:tracing.netHttp.indexName', { count: 2 })
  },

  detailView: 'NetHttpSpanDetailView',

  getLabel
});
