/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { useObservable } from '@instana/hooks';
import React from 'react';

import ApplicationEntityOpenIssuesList from 'in-applications/components/ApplicationEntityHealthIndicatorBehavior/ApplicationEntityOpenIssuesList';
import getApplicationEntityHealthInfo from 'in-subscription/application/getApplicationEntityHealthInfo';
import { getTimeConfigAlignedToResultTime } from 'in-stores/time/config';
import Overlay from 'in-new-components/overlays/Overlay';
import { t } from 'in-i18n';

export default function ApplicationEntityHealthIndicatorBehavior(props) {
  let { openIssues, maxSeverity, applicationId, serviceId, endpointId, timeConfig } = props;
  let healthInfo = useObservable(
    fetchAndMapApplicationEntityHealthInfo({
      applicationId,
      serviceId,
      endpointId,
      timeConfig: healthInfo?.timeConfig || timeConfig,
      openIssues,
      maxSeverity
    }),
    []
  );

  // Previous values when the openIssues, maxSeverity weere undefined are needed to be replaced
  healthInfo = openIssues != null && maxSeverity != null ? { openIssues, maxSeverity, timeConfig } : healthInfo;

  if (healthInfo?.openIssues == null || healthInfo?.openIssues < 0) {
    return null;
  }

  if (healthInfo?.openIssues === 0) {
    return (
      <props.IndicatorPresenter
        showCheckAsNeutral
        maxSeverity={healthInfo.maxSeverity}
        openIssues={props.inContentArea ? healthInfo.openIssues : t('in-applications:noIssues')}
      />
    );
  }

  return (
    <Overlay props={{ ...props, healthInfo }} content={Content} withoutWrapper inContentArea={props.inContentArea}>
      {Indicator}
    </Overlay>
  );
}

function Indicator({ healthInfo, IndicatorPresenter, refSetter, toggle }) {
  const count = healthInfo?.openIssues ?? 0;
  return (
    <IndicatorPresenter
      openIssues={t('in-applications:openIssues', {
        count
      })}
      maxSeverity={healthInfo?.maxSeverity}
      onClick={toggle}
      refSetter={refSetter}
    />
  );
}

function Content(props) {
  return <ApplicationEntityOpenIssuesList {...props} />;
}

function fetchAndMapApplicationEntityHealthInfo({
  applicationId,
  serviceId,
  endpointId,
  timeConfig,
  openIssues,
  maxSeverity
}) {
  if (openIssues != null && maxSeverity != null) {
    return null;
  }

  return getApplicationEntityHealthInfo({
    applicationId,
    serviceId,
    endpointId,
    timeConfig
  }).map(result => {
    return {
      openIssues: result?.data?.openIssues.length,
      maxSeverity: result?.data?.maxSeverity,
      timeConfig: getTimeConfigAlignedToResultTime(timeConfig, result)
    };
  });
}
