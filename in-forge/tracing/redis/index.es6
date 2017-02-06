import {registerSpanDefinition} from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'redis',
  category: 'database',

  typeName: {
    singular: 'Redis call',
    plural: 'Redis calls'
  },

  detailView: 'RedisSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'redis', 'command']);
  }
});
