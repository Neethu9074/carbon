import {registerSpanDefinition} from 'in-sdk/registry/tracing';

registerSpanDefinition({
  type: 'session',
  category: 'database',
  direction: 'exit',

  typeName: {
    singular: 'Session Call',
    plural: 'Session Calls'
  },

  detailView: 'SessionSpanDetailView',

  getLabel() {
    return 'Session Start';
  }
});
