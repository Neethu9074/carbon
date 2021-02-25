/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { registerSpanDefinition } from 'in-sdk/tracing';

registerSpanDefinition({
  type: 'php.compile',
  category: 'generic',
  direction: 'local',

  typeName: {
    singular: 'PHP Compile Time',
    plural: 'PHP Compile Time'
  },

  detailView: 'PhpCompileSpanDetailView',

  getLabel() {
    return t('in-forge:tracing.phpCompile.totalCompileTime');
  }
});
