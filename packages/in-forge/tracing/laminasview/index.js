/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'laminasview',
  category: t('in-forge:tracingCategory.generic'),
  direction: 'local',

  detailView: 'LaminasViewSpanDetailView',

  getLabel(span) {
    const template = span.getIn(['data', 'laminasview', 'template']);

    if (template) {
      return template;
    }

    return t('in-forge:tracing.laminasView.indexReturn');
  }
});
