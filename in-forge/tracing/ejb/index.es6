import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'ejb',
  category: 'remote',

  typeName: {
    singular: 'Enterprise Java Bean',
    plural: 'Enterprise Java Beans'
  },

  detailView: 'EJBSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'ejb', 'method']);
  }
});

registerSpanDefinition({
  type: 'ejb-schedule',
  category: 'generic',

  typeName: {
    singular: 'Enterprise Java Beans Scheduled Job',
    plural: 'Enterprise Java Beans Scheduled Jobs'
  },

  detailView: 'EJBScheduleSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'ejb', 'schedule', 'id']);
  }
});
