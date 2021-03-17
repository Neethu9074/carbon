/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'otel',
  category: t('in-forge:tracingCategory.generic', 'generic'),

  detailView: 'OTelSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'service']) + ' ' + span.getIn(['data', 'operation']);
  }
});
