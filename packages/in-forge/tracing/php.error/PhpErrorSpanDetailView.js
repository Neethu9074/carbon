/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Dl, Di } from 'in-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

const errorLevelTranslation = {
  1: 'E_ERROR',
  4: 'E_PARSE',
  16: 'E_CORE_ERROR',
  64: 'E_COMPILE_ERROR',
  256: 'E_USER_ERROR',
  4096: 'E_RECOVERABLE_ERROR'
};

export default function PhpErrorSpanDetailView({ span }) {
  const errorLevel = span.getIn(['data', 'error', 'level']);
  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.phpError.message')}>{span.getIn(['data', 'error', 'msg'])}</Di>
        <Di title={t('in-forge:tracing.phpError.class')}>{span.getIn(['data', 'error', 'class'])}</Di>
        <Di title={t('in-forge:tracing.phpError.level')}>
          {errorLevel != null ? errorLevelTranslation[errorLevel] : null}
        </Di>
        <Di title={t('in-forge:tracing.phpError.functionMethod')}>{span.getIn(['data', 'error', 'function'])}</Di>
        <Di title={t('in-forge:tracing.phpError.type')}>{span.getIn(['data', 'error', 'type'])}</Di>
        <Di title={t('in-forge:tracing.phpError.file')}>{span.getIn(['data', 'error', 'file'])}</Di>
        <Di title={t('in-forge:tracing.phpError.line')}>{span.getIn(['data', 'error', 'line'])}</Di>
      </Dl>
    </div>
  );
}
