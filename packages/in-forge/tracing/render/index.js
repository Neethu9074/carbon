/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'render',
  category: t('in-forge:tracingCategory.generic', 'generic'),
  direction: 'local',

  detailView: 'RenderSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'render', 'type']) + ' => ' + span.getIn(['data', 'render', 'name']);
  }
});
