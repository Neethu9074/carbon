/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'laminas',
  category: 'generic',
  direction: 'local',

  typeName: {
    singular: 'Laminas',
    plural: 'Laminas'
  },

  detailView: 'LaminasSpanDetailView',

  getLabel(span) {
    const module = span.getIn(['data', 'laminas', 'module']);
    const controller = span.getIn(['data', 'laminas', 'controller']);
    const action = span.getIn(['data', 'laminas', 'action']);

    if (module && controller && action) {
      return module + ':' + controller + '::' + action;
    }
    if (controller && action) {
      return controller + '::' + action;
    }
    if (controller && !action) {
      return controller + '::unknown';
    }
    if (!controller && !action) {
      return 'Unknown::' + action;
    }
    return 'Laminas';
  }
});
