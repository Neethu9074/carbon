/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { shortenSqlStatement } from 'in-forge/tracing/jdbc/sql';
import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'oci8',
  category: t('in-forge:tracingCategory.database'),

  detailView: 'OCI8SpanDetailView',

  getLabel(span) {
    const statement = span.getIn(['data', 'oci8', 'stmt']);
    if (statement != null) {
      return shortenSqlStatement(statement);
    }

    const conn = span.getIn(['data', 'oci8', 'conn']);
    if (conn != null) {
      return conn;
    }

    return t('in-forge:tracing.oci8.unknownOci8Call');
  }
});
