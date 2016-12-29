import {registerSpanDefinition} from 'in-sdk/tracing';
import {getLabel} from 'in-forge/tracing/http/spanDefinition';

registerSpanDefinition({
  type: 'py.http',
  category: 'http',
  direction: 'entry',
  searchAliases: ['py', 'python', 'http'],

  typeName: {
    singular: 'HTTP Call',
    plural: 'HTTP Calls'
  },

  detailView: 'PythonHttpServerSpanDetailView',

  getLabel
});
