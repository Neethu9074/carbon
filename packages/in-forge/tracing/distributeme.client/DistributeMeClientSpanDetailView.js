/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function DistributeMeClientSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.distributemeClient.titleService')}>
          {span.getIn(['data', 'distributeme', 'service'])}
        </Di>
        <Di title={t('in-forge:tracing.distributemeClient.titleMethod')}>
          {span.getIn(['data', 'distributeme', 'method'])}
        </Di>
        <ErrorDescriptionItem error={span.getIn(['data', 'distributeme', 'error'])} />
      </Dl>
    </div>
  );
}
