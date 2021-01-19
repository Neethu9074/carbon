/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'laravel',
  category: 'generic',
  direction: 'local',

  typeName: {
    singular: 'Laravel',
    plural: 'Laravels'
  },

  detailView: 'LaravelSpanDetailView',

  getLabel(span) {
    const controller = span.getIn(['data', 'laravel', 'controller']);
    const action = span.getIn(['data', 'laravel', 'action']);

    if (controller && action) {
      return controller + '@' + action;
    }
    // Closure
    if (controller && !action) {
      return controller;
    }
    if (!controller && !action) {
      return 'Unknown@' + 'unknown';
    }
    return 'Laravel';
  }
});
