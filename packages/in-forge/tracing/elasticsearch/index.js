/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'elasticsearch',
  category: t('in-forge:tracingCategory.database'),

  detailView: 'ElasticsearchSpanDetailView',

  groupingDetailView: 'ElasticsearchSpanGroupingDetailView',

  getLabel(span) {
    return span.getIn(['data', 'elasticsearch', 'action']);
  }
});
