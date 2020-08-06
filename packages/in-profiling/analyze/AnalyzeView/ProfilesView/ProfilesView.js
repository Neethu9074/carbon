import { compose, withPropsOnChange } from 'recompose';
import { just } from 'reactive-observables';
import React, { useState } from 'react';

import { processIdUrlParameter, timeUrlParameter, thresholdUrlParameter } from 'in-profiling/navigation/urlParameters';
import { highlightedTimeframe$ } from 'in-stores/timeline/highlightedTimeframe';
import { hasError, isLoading, success } from 'in-services/util/result';
import ContextGuide from 'in-new-components/ContextGuide/ContextGuide';
import { closeProfilesViewLink } from 'in-profiling/navigation/paths';
import tabs from 'in-profiling/analyze/AnalyzeView/ProfilesView/tabs';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import getProfiles from 'in-profiling/subscriptions/getProfiles';
import DashboardHeader from 'in-new-components/DashboardHeader';
import { getSnapshot, getSnapshots } from 'in-stores/snapshot';
import { getPhysicalHierarchy } from 'in-stores/snapshot';
import { isEntityOnline } from 'in-stores/snapshot';
import withUrlState from 'in-hoc/withUrlState';
import { plugins } from 'in-forge/constants';
import { getLabel } from 'in-sdk/snapshot';
import connect from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import locals from './ProfilesView.mless';

export const viewTypes = {
  flameGraph: 'flameGraph',
  tree: 'tree'
};

export default compose(
  withUrlState({
    bind: [processIdUrlParameter, timeUrlParameter, thresholdUrlParameter],
    reducerName: 'onChangeUrlState'
  }),
  withPropsOnChange(['timeConfig', 'time'], ({ timeConfig, time }) => ({
    timeConfigForSnapshots: {
      to: time ? time : timeConfig.to,
      focusedMoment: time ? time : timeConfig.focusedMoment,
      autoRefresh: false,
      windowSize: timeConfig.windowSize
    },
    timeConfig: {
      ...timeConfig,
      autoRefresh: false
    }
  })),
  connect(({ processId, timeConfigForSnapshots, timeConfig }) => {
    const hierachy$ = getPhysicalHierarchy({ snapshotId: processId, timeConfigForSnapshots }).filter(
      hierarchy => hierarchy && hierarchy.size > 0
    );
    const jvmSnapshot$ = hierachy$
      .flatMap(hierachy => getSnapshots(hierachy.toJS(), timeConfigForSnapshots))
      .map(
        hierarchySnapshots =>
          hierarchySnapshots.filter(snapshot => snapshot.get('plugin') === plugins.jvmRuntimePlatform)[0]
      );
    return {
      deepestTechSnapshot: hierachy$.flatMap(hierachy => getSnapshot(hierachy.get(0), timeConfigForSnapshots)),
      historicalProcessSnapshot: getSnapshot(processId, timeConfigForSnapshots),
      highlightedTimeframe: highlightedTimeframe$,
      processSnapshot: getSnapshot(processId, timeConfig),
      jvmSnapshot: jvmSnapshot$,

      // we only allow source code when using a jvm based tech
      canFetchSourceCode: jvmSnapshot$.flatMap(jvmSnapshot => (jvmSnapshot ? isEntityOnline(processId) : just(false)))
    };
  })
)(ProfilesView);

function ProfilesView(props) {
  // will be mounted in the header as soon as they are refactored
  const [viewType, setViewType] = useState(viewTypes.tree);

  const {
    processSnapshot,
    historicalProcessSnapshot,
    deepestTechSnapshot,
    jvmSnapshot,
    canFetchSourceCode,
    processId,
    timeConfig,
    threshold,
    location,
    highlightedTimeframe,
    onChangeUrlState
  } = props;

  return (
    <TabView
      // Discard all state when the process ID changes
      key={processId}
      HeaderComponent={Header}
      tabs={tabs}
      location={location}
      result$={getProfileResult(processId, timeConfig, highlightedTimeframe)}
      withProps={({ result }) => ({
        viewType,
        setViewType,
        profiles: result.data,
        processSnapshot,
        highlightedTimeframe,
        deepestTechSnapshot: deepestTechSnapshot || processSnapshot || historicalProcessSnapshot,
        jvmSnapshot,
        canFetchSourceCode,
        threshold,
        setThreshold: v => onChangeUrlState({ threshold: v })
      })}
      props={props}
      withoutBreadcrumb
      withoutPadding
    />
  );
}

function Header(props) {
  const label = `Profiles of Process ${props.deepestTechSnapshot ? getLabel(props.deepestTechSnapshot) : ''}`;

  return (
    <DashboardHeader
      {...props}
      icon="lib_profiling"
      label={label}
      title="Profiles"
      labelForTitle=""
      renderButtonLine={renderButtonLine}
      contextConfigurations={[{ renderContext, contextIcon: 'lib_analyze_inverted' }]}
    />
  );
}

function renderButtonLine({ processId, timeConfig }) {
  return <ContextGuide id={processId} timeConfig={timeConfig} includeSelfEntity />;
}

function renderContext() {
  return (
    <Link className={locals.contextLink} href$={closeProfilesViewLink}>
      Analyze profiles
    </Link>
  );
}

function getProfileResult(processId, timeConfig, highlightedTimeframe) {
  return (
    getProfiles({
      processSnapshotId: processId,
      filter: { timeConfig }
    })
      .distinct()
      // one can highlight a timeframe and the whole view will be reduced to this time
      // thought the raw event timestamps must be the same as in the "original" result
      .flatMap(profileResult => {
        if (!highlightedTimeframe || isLoading(profileResult) || hasError(profileResult)) {
          return just(profileResult);
        }

        return getProfiles({
          processSnapshotId: processId,
          filter: {
            timeConfig: {
              ...timeConfig,
              windowSize: highlightedTimeframe[1] - highlightedTimeframe[0],
              focusedMoment: highlightedTimeframe[1],
              to: highlightedTimeframe[1]
            }
          }
        })
          .distinct()
          .map(profileResultForTimeframe => {
            if (isLoading(profileResultForTimeframe) || hasError(profileResultForTimeframe)) {
              return profileResultForTimeframe;
            }
            if (
              !profileResultForTimeframe.data.cpuProfile &&
              !profileResultForTimeframe.data.memoryProfile &&
              !profileResultForTimeframe.data.timeProfile
            ) {
              const flaggedData = {
                ...profileResult.data
              };
              addMissingProfileFlagToProfile(flaggedData, 'cpuProfile');
              addMissingProfileFlagToProfile(flaggedData, 'memoryProfile');
              addMissingProfileFlagToProfile(flaggedData, 'timeProfile');
              return success(flaggedData);
            }
            return success(mergeResultWithOriginalRawTimestamps(profileResultForTimeframe.data, profileResult.data));
          });
      })
  );
}

function addMissingProfileFlagToProfile(data, profilePropertyName) {
  if (data[profilePropertyName]) {
    data[profilePropertyName] = {
      ...data[profilePropertyName],
      __missingProfileFlag: true
    };
  }
}

function mergeResultWithOriginalRawTimestamps(data, originalData) {
  const mergedData = {
    ...data
  };
  copyTimestampsForProfile(mergedData, data, originalData, 'cpuProfile');
  copyTimestampsForProfile(mergedData, data, originalData, 'memoryProfile');
  copyTimestampsForProfile(mergedData, data, originalData, 'timeProfile');
  return mergedData;
}

function copyTimestampsForProfile(mergedData, data, originalData, profilePropertyName) {
  if (data[profilePropertyName] && originalData[profilePropertyName]) {
    mergedData[profilePropertyName] = {
      ...data[profilePropertyName],
      rawProfileTimestamps: originalData[profilePropertyName].rawProfileTimestamps,
      numberOfProfiles: data[profilePropertyName]?.rawProfileTimestamps?.length
    };
  }
}
