/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { shortenSqlStatement } from 'in-forge/tracing/jdbc/sql';
import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'sdk.database',
  category: t('in-forge:tracingCategory.database', 'database'),

  detailView: 'DatabaseSpanDetailView',

  getLabel(span) {
    const statement = span.getIn(['data', 'db', 'statement']);
    if (statement == null) {
      return span.getIn(['data', 'db', 'type']);
    }
    return shortenSqlStatement(statement);
  }
});
