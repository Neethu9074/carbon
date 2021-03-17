/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'session',
  category: t('in-forge:tracingCategory.database', 'database'),

  detailView: 'SessionSpanDetailView',

  getLabel() {
    return t('in-forge:tracing.session.sessionStart');
  }
});
