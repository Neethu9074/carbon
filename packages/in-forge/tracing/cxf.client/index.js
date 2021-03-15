/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getLabel } from 'in-forge/tracing/http/spanDefinition';
import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'cxf.client',
  category: 'http',

  typeName: {
    singular: t('in-forge:tracing.cxfClient.indexName'),
    plural: t('in-forge:tracing.cxfClient.indexName_plural')
  },

  detailView: 'CxfClientSpanDetailView',

  getLabel
});
