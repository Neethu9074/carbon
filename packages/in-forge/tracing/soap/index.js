/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getLabel } from 'in-forge/tracing/http/spanDefinition';
import { registerSpanDefinition } from 'in-sdk/tracing';

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
