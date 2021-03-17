/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'aerospike',
  category: t('in-forge:tracingCategory.cache', 'cache'),

  detailView: 'AerospikeSpanDetailView',

  getLabel(span) {
    return 'Aerospike ' + span.getIn(['data', 'aerospike', 'op']);
  }
});
