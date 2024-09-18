/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { shortenSqlStatement } from 'in-forge/tracing/jdbc/sql';
import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'sequel',
  category: t('in-forge:tracingCategory.database'),

  detailView: 'SequelSpanDetailView',

  groupingDetailView: 'SequelSpanGroupingDetailView',

  getLabel(span) {
    return shortenSqlStatement(span.getIn(['data', 'sequel', 'sql']));
  }
});
