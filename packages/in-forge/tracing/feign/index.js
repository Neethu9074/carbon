/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getLabel } from 'in-forge/tracing/http/spanDefinition';
import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'feign',
  category: 'http',

  typeName: {
    singular: t('in-forge:tracing.feign.indexName'),
    plural: t('in-forge:tracing.feign.indexName_plural')
  },

  detailView: 'FeignSpanDetailView',

  getLabel
});
