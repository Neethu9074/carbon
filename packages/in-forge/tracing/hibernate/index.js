/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'hibernate',
  category: t('in-forge:tracingCategory.database', 'database'),
  direction: 'local',

  detailView: 'HibernateSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'hibernate', 'type'], '') + span.getIn(['data', 'hibernate', 'sort'], '');
  }
});
