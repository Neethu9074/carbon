/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'wordpress',
  category: t('in-forge:tracingCategory.generic'),
  direction: 'local',

  detailView: 'WordpressSpanDetailView',

  getLabel(span) {
    const action = span.getIn(['data', 'wp', 'action']);
    const view = span.getIn(['data', 'wp', 'view']);

    if (action) {
      return action;
    } else if (view) {
      return t('in-forge:tracing.wordpress.renderView', { renderview: view });
    }
    return t('in-forge:tracing.wordpress.unknownCall');
  }
});
