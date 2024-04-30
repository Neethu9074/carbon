/*
 * (c) Copyright IBM Corp. 2024
 * (c) Copyright Instana Inc.
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
      <Di title={t('in-forge:tracing.sap.procTime')}>{span.getIn(['data', 'sap', 'procTime'])}</Di>
      <Di title={t('in-forge:tracing.sap.dbProcTime')}>{span.getIn(['data', 'sap', 'dbReqTime'])}</Di>
      <Di title={t('in-forge:tracing.sap.dbWpTime')}>{span.getIn(['data', 'sap', 'wpTime'])}</Di>
      <ErrorDescriptionItem error={span.getIn(['data', 'saprfc', 'error'])} />
    </>
  );
}
