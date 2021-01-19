/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'hbase',
  category: 'database',

  typeName: {
    singular: 'HBase Java Client call',
    plural: 'HBase Java Client calls'
  },

  detailView: 'HbaseSpanDetailView'
});
