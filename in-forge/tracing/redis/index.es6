import {registerSpanDefinition} from 'in-sdk/registry/tracing';

registerSpanDefinition({
  type: 'redis',

  typeName: {
    singular: 'Redis call',
    plural: 'Redis calls'
  },

  detailView: 'RedisSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'redis', 'command']);
  }
});
