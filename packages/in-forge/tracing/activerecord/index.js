/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { shortenSqlStatement } from 'in-forge/tracing/jdbc/sql';
import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'activerecord',
  category: t('in-forge:tracingCategory.database', 'database'),

  detailView: 'ActiveRecordSpanDetailView',

  groupingDetailView: 'ActiveRecordSpanGroupingDetailView',

  getLabel(span) {
    return shortenSqlStatement(span.getIn(['data', 'activerecord', 'sql']));
  }
});
