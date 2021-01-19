/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'actionview',
  category: 'generic',
  direction: 'local',

  typeName: {
    singular: 'ActionView',
    plural: 'ActionView Calls'
  },

  detailView: 'ActionViewSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'actionview', 'name']);
  }
});
