/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'jboss.scheduler',
  category: 'batch',

  typeName: {
    singular: 'JBoss Schedulable',
    plural: 'JBoss Schedulables'
  },

  detailView: 'JBossSchedulerSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'jboss', 'name']);
  }
});
