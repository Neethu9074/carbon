/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'prisma',
  category: t('in-forge:tracingCategory.database'),

  detailView: 'PrismaSpanDetailView',

  getLabel(span) {
    const model = span.getIn(['data', 'prisma', 'model'], '?');
    const action = span.getIn(['data', 'prisma', 'action'], '?');
    return `${model}.${action}`;
  }
});
