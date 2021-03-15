/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getLabel } from 'in-forge/tracing/http/spanDefinition';
import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'mule.client.http',
  category: 'http',

  typeName: {
    singular: t('in-forge:tracing.muleClientHttp.indexName'),
    plural: t('in-forge:tracing.muleClientHttp.indexName_plural')
  },

  detailView: 'MuleClientHttpSpanDetailView',

  getLabel
});
