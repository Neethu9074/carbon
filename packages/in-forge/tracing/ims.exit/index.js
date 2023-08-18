/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'ims.exit',
  category: t('in-forge:tracingCategory.database'),

  detailView: 'ImsExitDetailView',

  getLabel(span) {
    const exec = span.getIn(['data', 'imsexit', 'exec']);
    if (exec == null) {
      return t('in-forge:tracing.ims.titleImsExit');
    }
    return exec;
  }
});
