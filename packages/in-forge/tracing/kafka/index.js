/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'kafka',
  category: 'messaging',

  typeName: {
    singular: t('in-forge:tracing.kafka.indexName'),
    plural: t('in-forge:tracing.kafka.indexName_plural')
  },

  detailView: 'KafkaSpanDetailView',

  getLabel(span) {
    return `${span.getIn(['data', 'kafka', 'access'])} ${span.getIn(['data', 'kafka', 'service'])}`;
  }
});
