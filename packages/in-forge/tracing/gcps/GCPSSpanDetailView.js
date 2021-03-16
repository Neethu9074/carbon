/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function GCPSSpanDetailView({ span }) {
  const data = span.getIn(['data', 'gcps']),
    topic = data.get('top'),
    subscription = data.get('sub'),
    messageId = data.get('msgid');

  return (
    <Dl>
      <Di title={t('in-forge:tracing.gcps.titleOperation')}>{data.get('op')}</Di>
      <Di title={t('in-forge:tracing.gcps.titleProjectID')}>{data.get('projid')}</Di>
      {topic && <Di title={t('in-forge:tracing.gcps.titleTopic')}>{data.get('top')}</Di>}
      {subscription && <Di title={t('in-forge:tracing.gcps.titleSubscription')}>{subscription}</Di>}
      {messageId && <Di title={t('in-forge:tracing.gcps.titleMessageID')}>{messageId}</Di>}
      <ErrorDescriptionItem error={data.get('error')} />
    </Dl>
  );
}
