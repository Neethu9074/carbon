/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Dl, Di } from 'in-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function SdkSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.sdk.capturedArguments')}>{span.getIn(['data', 'sdk', 'arguments'])}</Di>
        <Di title={t('in-forge:tracing.sdk.capturedReturnValue')}>{span.getIn(['data', 'sdk', 'return'])}</Di>
        <Di title={t('in-forge:tracing.sdk.exception')}>{span.getIn(['data', 'sdk', 'exception'])}</Di>
      </Dl>
    </div>
  );
}
