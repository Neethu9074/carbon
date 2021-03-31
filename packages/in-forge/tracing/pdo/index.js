/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { shortenSqlStatement } from 'in-forge/tracing/jdbc/sql';
import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'pdo',
  category: t('in-forge:tracingCategory.database'),

  detailView: 'PdoSpanDetailView',

  getLabel(span) {
    const statement = span.getIn(['data', 'pdo', 'stmt']);
    if (statement == null) {
      return span.getIn(['data', 'pdo', 'dsn']) + '(' + span.getIn(['data', 'pdo', 'driver']) + ')';
    }
    return shortenSqlStatement(statement);
  }
});
