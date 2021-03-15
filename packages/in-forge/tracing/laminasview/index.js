/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'laminasview',
  category: 'generic',
  direction: 'local',

  typeName: {
    singular: t('in-forge:tracing.laminasView.indexName'),
    plural: t('in-forge:tracing.laminasView.indexName_plural')
  },

  detailView: 'LaminasViewSpanDetailView',

  getLabel(span) {
    const template = span.getIn(['data', 'laminasview', 'template']);

    if (template) {
      return template;
    }

    return t('in-forge:tracing.laminasView.indexReturn');
  }
});
