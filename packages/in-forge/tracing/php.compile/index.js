/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { registerSpanDefinition } from 'in-sdk/tracing';
import { t } from 'in-i18n';

registerSpanDefinition({
  type: 'php.compile',
  category: t('in-forge:tracingCategory.generic', 'generic'),
  direction: 'local',

  detailView: 'PhpCompileSpanDetailView',

  getLabel() {
    return t('in-forge:tracing.phpCompile.totalCompileTime');
  }
});
