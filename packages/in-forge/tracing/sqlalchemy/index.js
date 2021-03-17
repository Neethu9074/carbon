/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { shortenSqlStatement } from 'in-forge/tracing/jdbc/sql';
import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'sqlalchemy',
  category: t('in-forge:tracingCategory.database', 'database'),

  detailView: 'SQLAlchemySpanDetailView',

  groupingDetailView: 'SQLAlchemySpanGroupingDetailView',

  getLabel(span) {
    return shortenSqlStatement(span.getIn(['data', 'sqlalchemy', 'sql']));
  }
});
