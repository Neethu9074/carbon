import {registerSpanDefinition} from 'in-sdk/registry/tracing';

import {getLabel} from 'in-forge/tracing/log/spanDefinition';

registerSpanDefinition({
  type: 'logger',
  category: 'logger',
  direction: 'exit',

  typeName: {
    singular: 'Log',
    plural: 'Logs'
  },

  detailView: 'LogSpanDetailView',

  getLabel
});
