/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { useObservable } from '@instana/hooks';
import { TimeConfig } from '@instana/types';

//@ts-expect-error need TS migration
import ApplicationEntityOpenIssuesList from 'in-applications/components/ApplicationEntityHealthIndicatorBehavior/ApplicationEntityOpenIssuesList';
import getApplicationEntityHealthInfo from 'in-applications/subscriptions/getApplicationEntityHealthInfo';
import { getTimeConfigAlignedToResultTime } from 'in-stores/time/config';
import Overlay from 'in-components/overlays/Overlay';

interface ApplicationEntityHealthIndicatorProps {
  openIssues?: number;
  maxSeverity?: number;
  applicationId?: string;
  serviceId?: string;
  endpointId?: string;
  timeConfig: TimeConfig;
  IndicatorPresenter: any;
  inContentArea?: boolean;
}
export default function ApplicationEntityHealthIndicatorBehavior(props: ApplicationEntityHealthIndicatorProps) {
  let { openIssues, maxSeverity, applicationId, serviceId, endpointId, timeConfig, IndicatorPresenter } = props;
  let healthInfo = useObservable(
    fetchAndMapApplicationEntityHealthInfo({
      applicationId,
      serviceId,
      endpointId,
      timeConfig,
      openIssues,
      maxSeverity
    }),
    [timeConfig]
  );

  // Previous values when the openIssues, maxSeverity where undefined are needed to be replaced
  healthInfo = openIssues != null && maxSeverity != null ? { openIssues, maxSeverity, timeConfig } : healthInfo;

  if (healthInfo?.openIssues == null || healthInfo?.openIssues < 0) {
    return null;
  }

  if (healthInfo?.openIssues === 0) {
    return (
      <IndicatorPresenter showCheckAsNeutral maxSeverity={healthInfo.maxSeverity} openIssues={healthInfo.openIssues} />
    );
  }

  return (
    <Overlay
      props={{ ...props, healthInfo }}
      content={Content}
      inContentArea={props.inContentArea}
      align="leftTop"
      withoutWrapper
    >
      {({ toggle, refSetter, isOpen }) => (
        <IndicatorPresenter
          openIssues={healthInfo?.openIssues ?? 0}
          maxSeverity={healthInfo?.maxSeverity ?? 0}
          onClick={toggle}
          refSetter={refSetter}
          isOpen={isOpen}
        />
      )}
    </Overlay>
  );
}

function Content(props: ApplicationEntityHealthIndicatorProps) {
  return <ApplicationEntityOpenIssuesList {...props} />;
}

type ApplicationEntityHealthInfoProps = Omit<
  ApplicationEntityHealthIndicatorProps,
  'IndicatorPresenter' | 'inContentArea'
>;

function fetchAndMapApplicationEntityHealthInfo({
  applicationId,
  serviceId,
  endpointId,
  timeConfig,
  openIssues,
  maxSeverity
}: ApplicationEntityHealthInfoProps) {
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
