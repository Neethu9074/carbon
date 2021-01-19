/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

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
        <Di title="Message">{span.getIn(['data', 'error', 'msg'])}</Di>
        <Di title="Class">{span.getIn(['data', 'error', 'class'])}</Di>
        <Di title="Level">{errorLevel != null ? errorLevelTranslation[errorLevel] : null}</Di>
        <Di title="Function/Method">{span.getIn(['data', 'error', 'function'])}</Di>
        <Di title="Type">{span.getIn(['data', 'error', 'type'])}</Di>
        <Di title="File">{span.getIn(['data', 'error', 'file'])}</Di>
        <Di title="Line">{span.getIn(['data', 'error', 'line'])}</Di>
      </Dl>
    </div>
  );
}
