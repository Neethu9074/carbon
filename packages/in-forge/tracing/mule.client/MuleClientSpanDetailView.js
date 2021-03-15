/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function MuleClientSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.muleClient.titleProtocol')}>{span.getIn(['data', 'mule', 'protocol'])}</Di>
        <Di title={t('in-forge:tracing.muleClient.titleAddress')}>{span.getIn(['data', 'mule', 'address'])}</Di>
        <Di title={t('in-forge:tracing.muleClient.titlePattern')}>{span.getIn(['data', 'mule', 'pattern'])}</Di>
      </Dl>
    </div>
  );
}
