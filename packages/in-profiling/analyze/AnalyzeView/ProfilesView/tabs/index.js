/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { just } from '@instana/observables';
import React from 'react';

import { CpuProfileChart, MemoryProfileChart } from 'in-profiling/analyze/AnalyzeView/ProfilesView/ProfileChart';
import { analyzeProfilePathFullyQualified } from 'in-new-components/Profiling/navigation/paths';
import getProfiles from 'in-new-components/Profiling/subscriptions/getProfiles';
import { highlightedTimeframe$ } from 'in-stores/timeline/highlightedTimeframe';
import View from 'in-profiling/analyze/AnalyzeView/ProfilesView/Hotspot/View';
import Profile from 'in-profiling/analyze/AnalyzeView/ProfilesView/Profile';
import { success, hasError, isLoading } from 'in-services/util/result';
import useObservable from 'in-hooks/useObservable';

export default [
  {
    label: 'Summary',
    path: `${analyzeProfilePathFullyQualified}/summary`,
    component: HotspotView
  },
  {
    label: 'CPU',
    path: `${analyzeProfilePathFullyQualified}/cpu`,
    component: CpuProfile,
    isVisible: result => result.data && result.data.cpuProfile
  },
  {
    label: 'Memory',
    path: `${analyzeProfilePathFullyQualified}/memory`,
    component: MemoryProfile,
    isVisible: result => result.data && result.data.memoryProfile
  },
  {
    label: 'Wait Time',
    path: `${analyzeProfilePathFullyQualified}/time`,
    component: TimeProfile,
    isVisible: result => result.data && result.data.timeProfile
  }
];

function HotspotView(props) {
  return (
    <EnrichWithProfilesForHighlightedTimeframe {...props}>
      {props => <View {...props} />}
    </EnrichWithProfilesForHighlightedTimeframe>
  );
}

function CpuProfile(props) {
  return (
    <EnrichWithProfilesForHighlightedTimeframe {...props}>
      {props => (
        <Profile
          isCpuProfile
          profile={props.data.cpuProfile}
          renderChart={CpuProfileChart}
          {...props}
          profileForHighlightedTimeframeResult={getProfileForHighlightedTimeframeResult(
            props.profilesForHighlightedTimeframeResult,
            'cpuProfile'
          )}
        />
      )}
    </EnrichWithProfilesForHighlightedTimeframe>
  );
}

function MemoryProfile(props) {
  return (
    <EnrichWithProfilesForHighlightedTimeframe {...props}>
      {props => (
        <Profile
          isMemoryProfile
          profile={props.data.memoryProfile}
          renderChart={MemoryProfileChart}
          {...props}
          profileForHighlightedTimeframeResult={getProfileForHighlightedTimeframeResult(
            props.profilesForHighlightedTimeframeResult,
            'memoryProfile'
          )}
        />
      )}
    </EnrichWithProfilesForHighlightedTimeframe>
  );
}

function TimeProfile(props) {
  return (
    <EnrichWithProfilesForHighlightedTimeframe {...props}>
      {props => (
        <Profile
          isWaitTimeProfile
          profile={props.data.timeProfile}
          renderChart={CpuProfileChart}
          {...props}
          profileForHighlightedTimeframeResult={getProfileForHighlightedTimeframeResult(
            props.profilesForHighlightedTimeframeResult,
            'timeProfile'
          )}
        />
      )}
    </EnrichWithProfilesForHighlightedTimeframe>
  );
}

function EnrichWithProfilesForHighlightedTimeframe(props) {
  const { children, processId, timeConfig } = props;

  const highlightedTimeframe = useObservable(highlightedTimeframe$, []);

  const profilesForHighlightedTimeframeResult = useObservable(getProfilesForHighlightedTimeframeResult, [
    highlightedTimeframe,
    processId,
    timeConfig
  ]);

  return children({ ...props, profilesForHighlightedTimeframeResult, highlightedTimeframe });
}

function getProfileForHighlightedTimeframeResult(profilesForHighlightedTimeframeResult, fieldName) {
  if (
    !profilesForHighlightedTimeframeResult ||
    isLoading(profilesForHighlightedTimeframeResult) ||
    hasError(profilesForHighlightedTimeframeResult)
  ) {
    return profilesForHighlightedTimeframeResult;
  }
  const profile = profilesForHighlightedTimeframeResult.data[fieldName];
  return success(profile);
}

function getProfilesForHighlightedTimeframeResult([highlightedTimeframe, processId, timeConfig]) {
  return highlightedTimeframe
    ? getProfiles({
        processSnapshotId: processId,
        filter: {
          timeConfig: {
            ...timeConfig,
            windowSize: highlightedTimeframe[1] - highlightedTimeframe[0],
            focusedMoment: highlightedTimeframe[1],
            to: highlightedTimeframe[1]
          }
        }
      }).distinct()
    : just(null);
}
