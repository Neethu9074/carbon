import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'ejb-schedule',
  category: 'batch',

  typeName: {
    singular: 'Enterprise Java Beans Scheduled Job',
    plural: 'Enterprise Java Beans Scheduled Jobs'
  },

  detailView: 'EJBScheduleSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'ejb', 'schedule', 'id']);
  }
});
