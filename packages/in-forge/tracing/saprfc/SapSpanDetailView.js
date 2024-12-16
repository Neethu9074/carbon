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
      <Di title={t('in-forge:tracing.sap.dvUnit')}>{span.getIn(['data', 'sap', 'dvUnit'])}</Di>
      <Di title={t('in-forge:tracing.sap.component')}>{span.getIn(['data', 'sap', 'component'])}</Di>
      <Di title={t('in-forge:tracing.sap.probClass')}>{span.getIn(['data', 'sap', 'probClass'])}</Di>
      <Di title={t('in-forge:tracing.sap.program')}>{span.getIn(['data', 'sap', 'program'])}</Di>
      <Di title={t('in-forge:tracing.sap.msgArea')}>{span.getIn(['data', 'sap', 'msgArea'])}</Di>
      <Di title={t('in-forge:tracing.sap.developmentClass')}>{span.getIn(['data', 'sap', 'devClass'])}</Di>
      <Di title={t('in-forge:tracing.sap.appComponent')}>{span.getIn(['data', 'sap', 'appComponent'])}</Di>
      <ErrorDescriptionItem error={span.getIn(['data', 'sap', 'errorMessage'])} />
    </>
  );
}
