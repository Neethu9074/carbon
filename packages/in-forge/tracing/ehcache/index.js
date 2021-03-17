/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'ehcache',
  category: t('in-forge:tracingCategory.cache', 'cache'),

  detailView: 'EhcacheSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'action']) + ' ' + span.getIn(['data', 'name']);
  }
});
