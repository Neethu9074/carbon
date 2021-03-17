/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'wcf',
  category: t('in-forge:tracingCategory.remote', 'remote'),

  detailView: 'WcfApiSpanDetailView',

  getLabel(span) {
    return span.getIn(['data', 'wcf', 'svcclass']) + '.' + span.getIn(['data', 'wcf', 'svcmethod']);
  }
});
