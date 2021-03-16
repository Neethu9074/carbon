/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { t } from 'in-i18n';

export default function PhpCompileSpanDetailView() {
  return (
    <div>
      <p>{t('in-forge:tracing.phpCompile.phpCompileDetailMsg1')}</p>
      <p>{t('in-forge:tracing.phpCompile.phpCompileDetailMsg2')} </p>
    </div>
  );
}
