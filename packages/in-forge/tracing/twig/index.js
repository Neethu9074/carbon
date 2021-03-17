/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'twig',
  category: t('in-forge:tracingCategory.generic', 'generic'),
  direction: 'local',

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
