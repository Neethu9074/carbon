/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'solace',
  category: t('in-forge:tracingCategory.messaging'),

  detailView: 'SolaceSpanDetailView',

  getLabel(span) {
    return `${span.getIn(['data', 'solace', 'op'])} ${span.getIn(['data', 'solace', 'destination'])}`;
  }
});
