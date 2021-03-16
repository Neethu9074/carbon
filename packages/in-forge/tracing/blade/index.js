/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'blade',
  category: 'generic',
  direction: 'local',

  typeName: {
    singular: t('in-forge:tracing.blade.indexName'),
    plural: t('in-forge:tracing.blade.indexName_plural')
  },

  detailView: 'BladeSpanDetailView',

  getLabel(span) {
    const view_name = span.getIn(['data', 'blade', 'view']);
    if (view_name) {
      return view_name;
    }

    const template_path = span.getIn(['data', 'blade', 'path']);
    if (template_path) {
      return template_path.split('/').pop();
    }

    return t('in-forge:tracing.blade.indexReturn');
  }
});
