/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'ftp',
  category: 'io',

  typeName: {
    singular: 'FTP access',
    plural: 'FTP accesses'
  },

  detailView: 'FTPSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'ftp', 'type']) + ' ' + span.getIn(['data', 'ftp', 'file']);
  }
});
