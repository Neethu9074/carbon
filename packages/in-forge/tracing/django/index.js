/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { registerSpanDefinition } from 'in-sdk/tracing';
import { getLabel } from 'in-forge/tracing/http/spanDefinition';

registerSpanDefinition({
  type: 'django',
  category: 'http',

  typeName: {
    singular: 'Django',
    plural: 'Django Calls'
  },

  detailView: 'DjangoSpanDetailView',

  getLabel
});
