import React from 'react';

import getProfilesAvailable from 'in-new-components/Profiling/subscriptions/getProfilesAvailable';
import { getTopSelfTimeList, createProfileSignature } from 'in-new-components/Profiling/utils';
import { getUniqueErrors } from 'in-new-components/Errors/ErroneousResultPresenter';
import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import { getLinkToProfiles } from 'in-new-components/Profiling/navigation/paths';
import getProfiles from 'in-new-components/Profiling/subscriptions/getProfiles';
import HotspotList from 'in-new-components/Profiling/components/HotspotList';
import ViewAllWrapper from 'in-new-components/TopListCard/ViewAllWrapper';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { error, warning } from 'in-new-components/Message/types';
import ExpandableGroup from 'in-new-components/ExpandableGroup';
import { hasError, isLoading } from 'in-services/util/result';
import { percentage } from 'in-services/formatters/number';
import useTimeConfig from 'in-hooks/useTimeConfig';
import useObservable from 'in-hooks/useObservable';
import Message from 'in-new-components/Message';
import Link from 'in-components/Link';

import locals from './ProfileInformation.mless';

export default function ProfileInformation({ processSnapshotId, time, start, end }) {
  const timeConfig = useTimeConfig();
  const profilesAvailable = useObservable(
    getProfilesAvailable({
      processSnapshotId,
      timeConfig: {
        windowSize: end - start,
        to: end,
        focusedMoment: end
      }
    }).map(result => result?.data?.containsProfiles || false),
    [processSnapshotId, timeConfig]
  );

  if (!profilesAvailable) {
    return null;
  }

  return (
    <ExpandableGroup title="Profiling">
      <Content processSnapshotId={processSnapshotId} start={start} end={end} time={time} />
    </ExpandableGroup>
  );
}

function Content({ processSnapshotId, start, end, time }) {
  const result = useObservable(
    getProfiles({
      processSnapshotId,
      filter: {
        timeConfig: {
          windowSize: end - start,
          to: end,
          focusedMoment: end
        }
      }
    }).distinct(),
    [processSnapshotId, start, end]
  );

  if (!result || isLoading(result)) {
    return <LoadingIndicator text="Loading profile" />;
  }
  if (hasError(result)) {
    return (
      <Message type={error} small>
        {getUniqueErrors(result.errors)[0]}
      </Message>
    );
  }
  const cpuProfile = result?.data?.cpuProfile;
  if (!cpuProfile) {
    return (
      <Message type={warning} small>
        No CPU Profile available
      </Message>
    );
  }

  return (
    <div>
      <Chart
        key={2}
        snapshotId={processSnapshotId}
        timeConfig={getChartTimeConfig(cpuProfile, end)}
        y1={{
          metrics: ['cpu.user'],
          labels: ['CPU User'],
          formatter: percentage,
          type: 'area'
        }}
      />

      <ProfileStackTrace
        processSnapshotId={processSnapshotId}
        start={start}
        end={end}
        time={time}
        cpuProfile={cpuProfile}
      />

      <ViewAllWrapper
        renderViewAll={ViewAll}
        viewAllHref$={getLinkToProfiles({ processSnapshotId, start, end, time })}
      />
    </div>
  );
}

function getChartTimeConfig(cpuProfile, end) {
  const to = cpuProfile.rawProfileTimestamps[cpuProfile.rawProfileTimestamps.length - 1] ?? end;
  const from = cpuProfile.rawProfileTimestamps[0];
  const twoMinutes = 1000 * 60 * 2;
  return {
    to,
    focusedMoment: to,
    windowSize: Math.max(to - from, twoMinutes),
    autoRefresh: false
  };
}

function ProfileStackTrace({ processSnapshotId, cpuProfile, start, end, time }) {
  const { enrichedProfilesWithSelfTimes } = getTopSelfTimeList(cpuProfile);
  return (
    <>
      <h3 className={locals.hotspotHeading}>CPU Hotspots</h3>
      <HotspotList
        size="compact"
        profile={cpuProfile}
        hotspots={enrichedProfilesWithSelfTimes}
        getHref$={_profile =>
          getLinkToProfiles({
            hotspotAutoExpandRowId: createProfileSignature(_profile),
            processSnapshotId,
            start,
            end,
            time
          })
        }
      />
    </>
  );
}

function ViewAll({ viewAllHref$ }, className) {
  return (
    <Link className={className} href$={viewAllHref$}>
      Analyze profiles
    </Link>
  );
}
