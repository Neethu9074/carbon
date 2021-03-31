/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { shortenSqlStatement } from 'in-forge/tracing/jdbc/sql';
import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'ims.db',
  category: t('in-forge:tracingCategory.database'),

  detailView: 'ImsDbDetailView',

  getLabel(span) {
    const statement = span.getIn(['data', 'imsdb', 'stmt']);
    if (statement == null) {
      return 'IMS DB';
    }
    return shortenSqlStatement(statement);
  }
});
