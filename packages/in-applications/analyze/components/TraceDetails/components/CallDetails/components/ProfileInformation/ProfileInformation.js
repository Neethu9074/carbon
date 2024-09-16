/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { ExpandableGroup } from '@instana/components';
import { useObservable } from '@instana/hooks';
import { Message } from '@instana/components';
import { Link } from '@instana/components';

import getProfilesAvailable from 'in-components/Profiling/subscriptions/getProfilesAvailable';
import { getTopSelfTimeList, createProfileSignature } from 'in-components/Profiling/utils';
import getProcessSnapshotId from 'in-infrastructure/subscriptions/getProcessSnapshotId';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { getUniqueErrors } from 'in-components/Errors/ErroneousResultPresenter';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import { useLinkToProfiles } from 'in-components/Profiling/navigation/paths';
import getProfiles from 'in-components/Profiling/subscriptions/getProfiles';
import HotspotList from 'in-components/Profiling/components/HotspotList';
import ViewAllWrapper from 'in-components/TopListCard/ViewAllWrapper';
import { hasError, isLoading } from 'in-services/util/result';
import { percentage } from 'in-services/formatters/number';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { minutes } from 'in-services/time';
import { t } from 'in-i18n';

import locals from './ProfileInformation.mless';

export default function ProfileInformationSnapshotResolver({ processSnapshotId, ...remainingProps }) {
  const timeConfig = useTimeConfig();

  const processEntitySnapshotIdResult = useObservable(getProcessSnapshotId$, [processSnapshotId, timeConfig]);
  function getProcessSnapshotId$([processSnapshotId, timeConfig]) {
    return getProcessSnapshotId({ snapshotId: processSnapshotId, timeConfig });
  }

  if (
    !processEntitySnapshotIdResult ||
    isLoading(processEntitySnapshotIdResult) ||
    hasError(processEntitySnapshotIdResult)
  ) {
    return null;
  }

  return (
    <ProfileInformation
      {...remainingProps}
      timeConfig={timeConfig}
      processSnapshotId={processEntitySnapshotIdResult.data}
    />
  );
}

function ProfileInformation({ processSnapshotId, time, start, end, timeConfig }) {
  const twoMinutes = minutes.toMillis(2);
  const windowSize = Math.max(twoMinutes, twoMinutes * Math.ceil((end - start) / twoMinutes));
  const from = start;
  const to = from + windowSize;

  const profilesAvailable = useObservable(
    getProfilesAvailable({
      processSnapshotId,
      timeConfig: {
        windowSize,
        to,
        focusedMoment: to
      }
    }).map(result => result?.data?.containsProfiles || false),
    [processSnapshotId, timeConfig]
  );

  if (!profilesAvailable) {
    return null;
  }

  return (
    <ExpandableGroup title={t('in-analyze:traceDetail.components.callDetails.profiling')}>
      <Content
        processSnapshotId={processSnapshotId}
        start={start}
        end={end}
        to={to}
        windowSize={windowSize}
        time={time}
      />
    </ExpandableGroup>
  );
}

function Content({ processSnapshotId, to, windowSize, time }) {
  const result = useObservable(
    getProfiles({
      processSnapshotId,
      filter: {
        timeConfig: {
          windowSize,
          to,
          focusedMoment: to
        }
      }
    }).distinct(),
    [processSnapshotId, to, windowSize]
  );
  const linkToProfiles = useLinkToProfiles({ processSnapshotId, start: to - windowSize, end: to, time });
  if (!result || isLoading(result)) {
    return <LoadingIndicator text={t('in-analyze:traceDetail.components.callDetails.loadingProfile')} />;
  }
  if (hasError(result)) {
    return (
      <Message type="error" small>
        {getUniqueErrors(result.errors)[0]}
      </Message>
    );
  }
  const cpuProfile = result?.data?.cpuProfile;
  if (!cpuProfile) {
    return (
      <Message type="warning" small>
        {t('in-analyze:traceDetail.components.callDetails.noCpuProfileAvailable')}
      </Message>
    );
  }

  return (
    <div>
      <Chart
        key={2}
        snapshotId={processSnapshotId}
        timeConfig={getChartTimeConfig(windowSize, to)}
        y1={{
          metrics: ['cpu.user'],
          labels: [t('in-analyze:traceDetail.components.callDetails.cpuUser')],
          formatter: percentage,
          type: 'area'
        }}
      />

      <ProfileStackTrace
        processSnapshotId={processSnapshotId}
        to={to}
        windowSize={windowSize}
        time={time}
        cpuProfile={cpuProfile}
      />
      <ViewAllWrapper ViewAll={ViewAll} viewAllHref={linkToProfiles} />
    </div>
  );
}

function getChartTimeConfig(windowSize, to) {
  return {
    to,
    focusedMoment: to,
    windowSize,
    autoRefresh: false
  };
}

const GetLinkToProfiles = (_profile, processSnapshotId, to, windowSize, time) => {
  return useLinkToProfiles({
    hotspotAutoExpandRowId: createProfileSignature(_profile),
    processSnapshotId,
    start: to - windowSize,
    end: to,
    time
  });
};

function ProfileStackTrace({ processSnapshotId, cpuProfile, to, windowSize, time }) {
  const { enrichedProfilesWithSelfTimes } = getTopSelfTimeList(cpuProfile);

  return (
    <>
      <h3 className={locals.hotspotHeading}>{t('in-analyze:traceDetail.components.callDetails.cpuHotspots')}</h3>
      <HotspotList
        size="compact"
        profile={cpuProfile}
        hotspots={enrichedProfilesWithSelfTimes}
        getHref={_profile => GetLinkToProfiles(_profile, processSnapshotId, to, windowSize, time)}
      />
    </>
  );
}

function ViewAll({ viewAllHref, className }) {
  return (
    <Link className={className} href={viewAllHref}>
      {t('in-analyze:traceDetail.components.callDetails.analyzeProfiles')}
    </Link>
  );
}
