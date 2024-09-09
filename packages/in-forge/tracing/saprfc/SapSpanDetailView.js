/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function SapSpanDetailView({ span }) {
  return (
    <Dl>
      <SapSpanDetailViewDescriptionList span={span} />
    </Dl>
  );
}

export function SapSpanDetailViewDescriptionList({ span }) {
  return (
    <>
      <Di title={t('in-forge:tracing.sap.callType')}>{span.getIn(['data', 'sap', 'report'])}</Di>
      <Di title={t('in-forge:tracing.sap.tcode')}>{span.getIn(['data', 'sap', 'tcode'])}</Di>
      <Di title={t('in-forge:tracing.sap.user')}>{span.getIn(['data', 'sap', 'user'])}</Di>
      <Di title={t('in-forge:tracing.sap.system')}>{span.getIn(['data', 'sap', 'system'])}</Di>
      <Di title={t('in-forge:tracing.sap.totalResTime')}>{span.getIn(['data', 'sap', 'totalResTime'])}</Di>
      <Di title={t('in-forge:tracing.sap.dbReqTime')}>{span.getIn(['data', 'sap', 'dbReqTime'])}</Di>
      <Di title={t('in-forge:tracing.sap.wpTime')}>{span.getIn(['data', 'sap', 'wpTime'])}</Di>
      <Di title={t('in-forge:tracing.sap.rollInTime')}>{span.getIn(['data', 'sap', 'rollInTime'])}</Di>
      <Di title={t('in-forge:tracing.sap.rollOutTime')}>{span.getIn(['data', 'sap', 'rollOutTime'])}</Di>
      <Di title={t('in-forge:tracing.sap.queueTime')}>{span.getIn(['data', 'sap', 'queueTime'])}</Di>
      <Di title={t('in-forge:tracing.sap.rollWaitTime')}>{span.getIn(['data', 'sap', 'rollWaitTime'])}</Di>
      <ErrorDescriptionItem error={span.getIn(['data', 'sap', 'errorMessage'])} />
    </>
  );
}
