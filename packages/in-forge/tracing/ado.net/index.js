/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { shortenSqlStatement } from 'in-forge/tracing/jdbc/sql';
import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'ado.net',
  category: t('in-forge:tracingCategory.database'),

  detailView: 'AdoNetSpanDetailView',

  getLabel(span) {
    const statement = span.getIn(['data', 'ado', 'command']);
    if (statement == null) {
      return span.getIn(['data', 'ado', 'connection']);
    }
    return shortenSqlStatement(statement);
  }
});
