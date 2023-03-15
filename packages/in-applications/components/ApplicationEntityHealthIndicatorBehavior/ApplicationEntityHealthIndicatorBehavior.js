/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { useObservable } from '@instana/hooks';

import ApplicationEntityOpenIssuesList from 'in-applications/components/ApplicationEntityHealthIndicatorBehavior/ApplicationEntityOpenIssuesList';
import getApplicationEntityHealthInfo from 'in-applications/subscriptions/getApplicationEntityHealthInfo';
import { getTimeConfigAlignedToResultTime } from 'in-stores/time/config';
import Overlay from 'in-components/overlays/Overlay';

export default function ApplicationEntityHealthIndicatorBehavior(props) {
  let { openIssues, maxSeverity, applicationId, serviceId, endpointId, timeConfig } = props;
  let healthInfo = useObservable(
    fetchAndMapApplicationEntityHealthInfo({
      applicationId,
      serviceId,
      endpointId,
      timeConfig,
      openIssues,
      maxSeverity
    }),
    []
  );

  // Previous values when the openIssues, maxSeverity where undefined are needed to be replaced
  healthInfo = openIssues != null && maxSeverity != null ? { openIssues, maxSeverity, timeConfig } : healthInfo;

  if (healthInfo?.openIssues == null || healthInfo?.openIssues < 0) {
    return null;
  }

  if (healthInfo?.openIssues === 0) {
    return (
      <props.IndicatorPresenter
        showCheckAsNeutral
        maxSeverity={healthInfo.maxSeverity}
        openIssues={healthInfo.openIssues}
      />
    );
  }

  return (
    <Overlay props={{ ...props, healthInfo }} content={Content} inContentArea={props.inContentArea} align="leftTop">
      {({ toggle, refSetter }) => (
        <props.IndicatorPresenter
          openIssues={healthInfo?.openIssues ?? 0}
          maxSeverity={healthInfo?.maxSeverity ?? 0}
          onClick={toggle}
          refSetter={refSetter}
        />
      )}
    </Overlay>
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
