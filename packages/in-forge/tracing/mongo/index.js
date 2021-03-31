/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'mongo',
  category: t('in-forge:tracingCategory.database'),

  detailView: 'MongoSpanDetailView',

  groupingDetailView: 'MongoSpanGroupingDetailView',

  getLabel(span) {
    return span.getIn(['data', 'mongo', 'command']);
  }
});
