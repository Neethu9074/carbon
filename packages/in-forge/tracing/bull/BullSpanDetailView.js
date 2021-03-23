/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function BullSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.bull.queue')}>{span.getIn(['data', 'bull', 'queue'])}</Di>
        <ErrorDescriptionItem error={span.getIn(['data', 'bull', 'error'])} />
      </Dl>
    </div>
  );
}
