/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'php.compile',
  category: 'generic',
  direction: 'local',

  typeName: {
    singular: 'PHP Compile Time',
    plural: 'PHP Compile Time'
  },

  detailView: 'PhpCompileSpanDetailView',

  getLabel() {
    return 'Total Compile Time';
  }
});
