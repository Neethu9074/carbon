/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function GCPSASpanDetailView({ span }) {
  const data = span.getIn(['data', 'gcpsa']),
    topic = data.get('top'),
    subscription = data.get('sub'),
    snapshot = data.get('snap');

  return (
    <Dl>
      <Di title={t('in-forge:tracing.gcpsa.titleOperation')}>{data.get('op')}</Di>
      <Di title={t('in-forge:tracing.gcpsa.titleProjectID')}>{data.get('projid')}</Di>
      {topic && <Di title={t('in-forge:tracing.gcpsa.titleTopic')}>{data.get('top')}</Di>}
      {subscription && <Di title={t('in-forge:tracing.gcpsa.titleSubscription')}>{subscription}</Di>}
      {snapshot && <Di title={t('in-forge:tracing.gcpsa.titleSnapshot')}>{snapshot}</Di>}
      <ErrorDescriptionItem error={data.get('error')} />
    </Dl>
  );
}
