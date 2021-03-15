/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { shortenSqlStatement } from 'in-forge/tracing/jdbc/sql';
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'activerecord',
  category: 'database',

  typeName: {
    singular: 'ActiveRecord',
    plural: 'ActiveRecord Calls'
  },

  detailView: 'ActiveRecordSpanDetailView',

  groupingDetailView: 'ActiveRecordSpanGroupingDetailView',

  getLabel(span) {
    return shortenSqlStatement(span.getIn(['data', 'activerecord', 'sql']));
  }
});
