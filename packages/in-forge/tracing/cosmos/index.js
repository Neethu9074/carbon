/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { shortenSqlStatement } from 'in-forge/tracing/jdbc/sql';
import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'cosmos',
  category: t('in-forge:tracingCategory.database'),

  detailView: 'CosmosSpanDetailView',

  getLabel(span) {
    return shortenSqlStatement(span.getIn(['data', 'cosmos', 'cmd'], ''));
  }
});
