/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function WebmethodsIntermediateSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.webmethods.titleService')}>{span.getIn(['data', 'webmethods', 'service'])}</Di>
        <ErrorDescriptionItem error={span.getIn(['data', 'webmethods', 'error'])} />
      </Dl>
    </div>
  );
}
