/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'webapi',
  category: 'generic',

  typeName: {
    singular: 'WebAPI-Controller',
    plural: 'WebAPI-Controllers'
  },

  detailView: 'WebApiSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'webapi', 'controller']);
  }
});
