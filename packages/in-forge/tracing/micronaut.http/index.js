/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import { getLabel } from 'in-forge/tracing/http/spanDefinition';
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'micronaut.http',
  category: 'http',

  typeName: {
    singular: t('in-forge:tracing.micronautHttp.indexName'),
    plural: t('in-forge:tracing.micronautHttp.indexName_plural')
  },

  detailView: 'MicronautHttpSpanDetailView',

  getLabel
});
