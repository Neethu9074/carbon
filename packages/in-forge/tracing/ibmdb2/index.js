/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { shortenSqlStatement } from 'in-forge/tracing/jdbc/sql';
import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'ibmdb2',
  category: t('in-forge:tracingCategory.database'),

  detailView: 'IbmDb2SpanDetailView',

  getLabel(span) {
    const statement = span.getIn(['data', 'db2', 'stmt']);
    return shortenSqlStatement(statement);
  }
});
