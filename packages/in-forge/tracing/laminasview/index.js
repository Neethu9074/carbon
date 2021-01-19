/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'laminasview',
  category: 'generic',
  direction: 'local',

  typeName: {
    singular: 'Laminas View',
    plural: 'Laminas Views'
  },

  detailView: 'LaminasViewSpanDetailView',

  getLabel(span) {
    const template = span.getIn(['data', 'laminasview', 'template']);

    if (template) {
      return template;
    }

    return 'Laminas View';
  }
});
