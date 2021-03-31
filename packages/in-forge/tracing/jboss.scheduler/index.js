/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'jboss.scheduler',
  category: t('in-forge:tracingCategory.batch'),

  detailView: 'JBossSchedulerSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'jboss', 'name']);
  }
});
