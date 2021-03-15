/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getLabel } from 'in-forge/tracing/http/spanDefinition';
import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'nanohttpd',
  category: 'http',

  typeName: {
    singular: t('in-forge:tracing.nanohttpd.indexName'),
    plural: t('in-forge:tracing.nanohttpd.indexName_plural')
  },

  detailView: 'NanohttpdSpanDetailView',

  getLabel
});
