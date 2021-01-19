/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'zfview',
  category: 'generic',
  direction: 'local',

  typeName: {
    singular: 'Zend View',
    plural: 'Zend Views'
  },

  detailView: 'ZendViewSpanDetailView',

  getLabel(span) {
    const template = span.getIn(['data', 'zfview', 'template']);

    if (template) {
      return template;
    }

    return 'Zend View';
  }
});
