/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'gcps',
  category: t('in-forge:tracingCategory.messaging', 'messaging'),

  detailView: 'GCPSSpanDetailView',

  getLabel(span) {
    return ['op', 'sub', 'top']
      .map(key => span.getIn(['data', 'gcps', key]))
      .filter(tag => tag)
      .join(' ');
  }
});
