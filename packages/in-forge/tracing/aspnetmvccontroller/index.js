/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'aspnetmvccontroller',
  category: 'generic',

  typeName: {
    singular: 'ASP.Net MVC-Controller',
    plural: 'ASP.Net MVC-Controllers'
  },

  detailView: 'AspNetMvcControllerSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'aspnetmvccontroller', 'controller']);
  }
});
