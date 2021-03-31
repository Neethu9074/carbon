/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import getLabel from 'in-forge/tracing/nats/label';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'nats',
  category: t('in-forge:tracingCategory.messaging'),

  detailView: 'NatsSpanDetailView',

  getLabel
});
