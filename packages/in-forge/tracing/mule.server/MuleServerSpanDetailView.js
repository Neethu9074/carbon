/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function MuleServerSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.muleServer.titleProtocol')}>{span.getIn(['data', 'mule', 'protocol'])}</Di>
        <Di title={t('in-forge:tracing.muleServer.titleAddress')}>{span.getIn(['data', 'mule', 'address'])}</Di>
        <Di title={t('in-forge:tracing.muleServer.titleFlow')}>{span.getIn(['data', 'mule', 'flow'])}</Di>
        <Di title={t('in-forge:tracing.muleServer.titlePattern')}>{span.getIn(['data', 'mule', 'pattern'])}</Di>
        <ErrorDescriptionItem error={span.getIn(['data', 'mule', 'error'])} />
      </Dl>
    </div>
  );
}
