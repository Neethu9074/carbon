/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'zfview',
  category: t('in-forge:tracingCategory.generic', 'generic'),
  direction: 'local',

  detailView: 'ZendViewSpanDetailView',

  getLabel(span) {
    const template = span.getIn(['data', 'zfview', 'template']);

    if (template) {
      return template;
    }

    return t('in-forge:tracing.zfview.zendView');
  }
});
