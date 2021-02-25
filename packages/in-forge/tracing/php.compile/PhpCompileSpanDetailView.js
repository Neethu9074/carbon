/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

export default function PhpCompileSpanDetailView() {
  return (
    <div>
      <p>{t('in-forge:tracing.phpCompile.phpCompileDetailMsg1')}</p>
      <p>{t('in-forge:tracing.phpCompile.phpCompileDetailMsg2')} </p>
    </div>
  );
}
