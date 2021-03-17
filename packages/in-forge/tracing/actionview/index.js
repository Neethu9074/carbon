/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'actionview',
  category: t('in-forge:tracingCategory.generic', 'generic'),
  direction: 'local',

  detailView: 'ActionViewSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'actionview', 'name']);
  }
});
