/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { shortenSqlStatement } from 'in-forge/tracing/jdbc/sql';
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'sqlalchemy',
  category: 'database',

  typeName: {
    singular: 'SQLAlchemy Call',
    plural: 'SQLAlchemy Calls'
  },

  detailView: 'SQLAlchemySpanDetailView',

  groupingDetailView: 'SQLAlchemySpanGroupingDetailView',

  getLabel(span) {
    return shortenSqlStatement(span.getIn(['data', 'sqlalchemy', 'sql']));
  }
});
