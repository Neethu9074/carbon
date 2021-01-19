/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { registerSpanDefinition } from 'in-sdk/tracing';
import { getLabel } from 'in-forge/tracing/http/spanDefinition';

registerSpanDefinition({
  type: 'soap',
  category: 'http',

  typeName: {
    singular: 'SOAP Request',
    plural: 'SOAP Requests'
  },

  detailView: 'SoapSpanDetailView',

  getLabel
});
