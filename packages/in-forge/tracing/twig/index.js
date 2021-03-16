/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'twig',
  category: 'generic',
  direction: 'local',

  typeName: {
    singular: 'Twig',
    plural: 'Twigs'
  },

  detailView: 'TwigSpanDetailView',

  getLabel(span) {
    const template_name = span.getIn(['data', 'twig', 'name']);
    if (template_name) {
      return template_name;
    }

    const template_path = span.getIn(['data', 'twig', 'path']);
    if (template_path) {
      return template_path.split('/').pop();
    }

    return 'Twig';
  }
});
