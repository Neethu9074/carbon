/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getLabel } from 'in-forge/tracing/http/spanDefinition';
import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'django',
  category: 'http',

  typeName: {
    singular: t('in-forge:tracing.django.indexName'),
    plural: t('in-forge:tracing.django.indexName_plural')
  },

  detailView: 'DjangoSpanDetailView',

  getLabel
});
