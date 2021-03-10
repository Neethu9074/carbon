/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import { registerSpanDefinition } from 'in-sdk/tracing';
import getLabel from 'in-forge/tracing/nats/label';

registerSpanDefinition({
  type: 'nats',
  category: 'messaging',

  typeName: {
    singular: t('in-forge:tracing.nats.indexName', { count: 1 }),
    plural: t('in-forge:tracing.nats.indexName', { count: 2 })
  },

  detailView: 'NatsSpanDetailView',

  getLabel
});
