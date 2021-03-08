/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function HzSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.hz.titleOperation')}>{span.getIn(['data', 'hz', 'op'])}</Di>
        <Di title={t('in-forge:tracing.hz.titleConnection')}>{span.getIn(['data', 'hz', 'conn'])}</Di>
        <Di title={t('in-forge:tracing.hz.titleName')}>{span.getIn(['data', 'hz', 'name'])}</Di>
        <ErrorDescriptionItem error={span.getIn(['data', 'hz', 'error'])} />
      </Dl>
    </div>
  );
}
