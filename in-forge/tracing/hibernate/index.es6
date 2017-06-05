import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'hibernate',
  category: 'database',
  direction: 'local',

  typeName: {
    singular: 'Hibernate Call',
    plural: 'Hibernate Calls'
  },

  detailView: 'HibernateSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'hibernate', 'type']) + span.getIn(['data', 'hibernate', 'sort']);
  }
});
