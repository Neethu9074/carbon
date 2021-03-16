/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'kinesis',
  category: 'messaging',

  typeName: {
    singular: t('in-forge:tracing.kinesis.indexName'),
    plural: t('in-forge:tracing.kinesis.indexName_plural')
  },

  detailView: 'KinesisSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'kinesis', 'op']) + ' on ' + span.getIn(['data', 'kinesis', 'stream']);
  }
});
