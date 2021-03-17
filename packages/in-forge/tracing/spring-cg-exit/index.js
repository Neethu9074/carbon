/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getLabel } from 'in-forge/tracing/http/spanDefinition';
import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'spring-cg-exit',
  category: t('in-forge:tracingCategory.http', 'http'),

  detailView: 'SpringCloudGatewaySpanDetailView',

  getLabel
});
