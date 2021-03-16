/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'zfview',
  category: 'generic',
  direction: 'local',

  typeName: {
    singular: 'Zend View',
    plural: 'Zend Views'
  },

  detailView: 'ZendViewSpanDetailView',

  getLabel(span) {
    const template = span.getIn(['data', 'zfview', 'template']);

    if (template) {
      return template;
    }

    return t('in-forge:tracing.zfview.zendView');
  }
});
