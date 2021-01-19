/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'blade',
  category: 'generic',
  direction: 'local',

  typeName: {
    singular: 'Blade',
    plural: 'Blades'
  },

  detailView: 'BladeSpanDetailView',

  getLabel(span) {
    const view_name = span.getIn(['data', 'blade', 'view']);
    if (view_name) {
      return view_name;
    }

    const template_path = span.getIn(['data', 'blade', 'path']);
    if (template_path) {
      return template_path.split('/').pop();
    }

    return 'Blade';
  }
});
