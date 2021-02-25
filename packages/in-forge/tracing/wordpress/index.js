/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'wordpress',
  category: 'generic',
  direction: 'local',

  typeName: {
    singular: 'Wordpress',
    plural: 'Wordpresses'
  },

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
