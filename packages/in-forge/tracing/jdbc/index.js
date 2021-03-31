/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { shortenSqlStatement } from 'in-forge/tracing/jdbc/sql';
import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'jdbc',
  category: t('in-forge:tracingCategory.database'),

  detailView: 'JdbcSpanDetailView',

  groupingDetailView: 'JdbcSpanGroupingDetailView',

  getLabel(span) {
    const statement = span.getIn(['data', 'jdbc', 'statement']);
    if (statement == null) {
      return span.getIn(['data', 'jdbc', 'connection']);
    }
    return shortenSqlStatement(statement);
  }
});
