/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import { registerSpanDefinition } from 'in-sdk/tracing';
import getLabel from 'in-forge/tracing/nats/label';

registerSpanDefinition({
  type: 'nats.streaming',
  category: 'messaging',

  typeName: {
    singular: t('in-forge:tracing.natsStreaming.indexName', { count: 1 }),
    plural: t('in-forge:tracing.natsStreaming.indexName', { count: 2 })
  },

  detailView: 'NatsStreamingSpanDetailView',

  getLabel
});
