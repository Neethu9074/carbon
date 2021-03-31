/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'wcfclient',
  category: t('in-forge:tracingCategory.remote'),

  detailView: 'WcfClientSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'wcfclient', 'contract']) + '.' + span.getIn(['data', 'wcfclient', 'method']);
  }
});
