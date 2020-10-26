import React, { useState, useEffect } from 'react';
import { just } from 'reactive-observables';

import { processIdUrlParameter, timeUrlParameter, thresholdUrlParameter } from 'in-profiling/navigation/urlParameters';
import { closeProfilesViewLink } from 'in-new-components/Profiling/navigation/paths';
import getProfiles from 'in-new-components/Profiling/subscriptions/getProfiles';
import { highlightedTimeframe$ } from 'in-stores/timeline/highlightedTimeframe';
import { setTimeConfig, fixateTimeConfig } from 'in-stores/time/config';
import ContextGuide from 'in-new-components/ContextGuide/ContextGuide';
import tabs from 'in-profiling/analyze/AnalyzeView/ProfilesView/tabs';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import DashboardHeader from 'in-new-components/DashboardHeader';
import { getSnapshot, getSnapshots } from 'in-stores/snapshot';
import { getPhysicalHierarchy } from 'in-stores/snapshot';
import { pendingResult } from 'in-services/fixedObjects';
import { isEntityOnline } from 'in-stores/snapshot';
import useObservable from 'in-hooks/useObservable';
import { mutateUrl } from 'in-stores/navigation';
import useUrlState from 'in-hooks/useUrlState';
import { plugins } from 'in-forge/constants';
import { getLabel } from 'in-sdk/snapshot';
import Link from 'in-components/Link';

import locals from './ProfilesView.mless';

export const viewTypes = {
  flameGraph: 'flameGraph',
  tree: 'tree'
};

export default function ProfilesViewUrlStateExtractor(props) {
  const [urlState, onChangeUrlState] = useUrlState({
    bind: [processIdUrlParameter, timeUrlParameter, thresholdUrlParameter]
  });

  return <TimeFixater {...urlState} {...props} onChangeUrlState={onChangeUrlState} />;
}

function TimeFixater(props) {
  let { timeConfig, time } = props;
  const highlightedTimeframe = useObservable(highlightedTimeframe$, []);

  // Fixate time config when a highlight is made.
  useEffect(() => {
    if (highlightedTimeframe && timeConfig.to == null) {
      mutateUrl(location => setTimeConfig(location, fixateTimeConfig(timeConfig)), true);
    }
  }, [highlightedTimeframe, timeConfig]);

  const to = timeConfig.to || Date.now();
  const timeConfigForSnapshots = {
    to: time ? time : timeConfig.to,
    focusedMoment: time ? time : timeConfig.focusedMoment,
    autoRefresh: false,
    windowSize: timeConfig.windowSize
  };

  return (
    <ProfilesView
      {...props}
      timeConfigForSnapshots={timeConfigForSnapshots}
      timeConfig={{
        ...timeConfig,
        to,
        focusedMoment: to,
        autoRefresh: false
      }}
    />
  );
}

function ProfilesView(props) {
  let { timeConfig, timeConfigForSnapshots, onChangeUrlState, processId, threshold, location } = props;

  const hierachy$ = getPhysicalHierarchy({ snapshotId: processId, timeConfigForSnapshots }).filter(
    hierarchy => hierarchy && hierarchy.size > 0
  );
  const hierachySnapshots$ = hierachy$.flatMap(hierachy =>
    getSnapshots(hierachy.toJS(), ...spreadTimeConfig(timeConfigForSnapshots))
  );
  const deepestTechSnapshot = useObservable(getDeepestTechSnapshot, [
    hierachy$,
    ...spreadTimeConfig(timeConfigForSnapshots)
  ]);
  const historicalProcessSnapshot = useObservable(getHistoricalProcessSnapshot, [
    processId,
    ...spreadTimeConfig(timeConfigForSnapshots)
  ]);
  const processSnapshot = useObservable(getProcessSnapshot, [processId, timeConfig]);
  const jvmSnapshot = useObservable(
    () => getJvmSnapshot([hierachySnapshots$]),
    spreadTimeConfig(timeConfigForSnapshots)
  );
  const phpSnapshot = useObservable(
    () => getPhpSnapshot([hierachySnapshots$]),
    spreadTimeConfig(timeConfigForSnapshots)
  );

  // we only allow source code when using a jvm based tech
  const canFetchSourceCode = useObservable(
    hierachySnapshots$.flatMap(hierachySnapshots =>
      getSnapshotWithPlugins(hierachySnapshots, [
        plugins.phpFpmRuntimePlatform,
        plugins.phpRuntimePlatform,
        plugins.httpd
      ]) || getSnapshotWithPlugin(hierachySnapshots, plugins.jvmRuntimePlatform)
        ? isEntityOnline(processId)
        : just(false)
    ),
    [processId]
  );

  // will be mounted in the header as soon as they are refactored
  const [viewType, setViewType] = useState(viewTypes.tree);

  return (
    <TabView
      // Discard all state when the process ID changes
      key={processId}
      HeaderComponent={Header}
      tabs={tabs}
      location={location}
      result$={getProfileResult(processId, timeConfig).startWith(pendingResult)}
      withProps={({ result }) => ({
        viewType,
        setViewType,
        profiles: result.data,
        phpSnapshot,
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
  return (
    <ContextGuide
      id={processId}
      timeConfig={timeConfig}
      plugin={plugins.process}
      tagFilters={[
        {
          name: 'process.snapshotId',
          operator: 'EQUALS',
          value: processId
        }
      ]}
      includeSelfEntity
    />
  );
}

function renderContext() {
  return (
    <Link className={locals.contextLink} href$={closeProfilesViewLink}>
      Analyze profiles
    </Link>
  );
}

function getProfileResult(processId, timeConfig) {
  return getProfiles({
    processSnapshotId: processId,
    filter: { timeConfig }
  }).distinct();
}

function getSnapshotWithPlugin(snapshots, plugin) {
  return snapshots.filter(snapshot => snapshot.get('plugin') === plugin)[0];
}

function getSnapshotWithPlugins(snapshots, _plugins) {
  return snapshots.filter(snapshot => _plugins.indexOf(snapshot.get('plugin') !== -1))[0];
}

function getHistoricalProcessSnapshot([processId, timeConfigForSnapshots]) {
  return getSnapshot(processId, timeConfigForSnapshots);
}

function getProcessSnapshot([processId, timeConfig]) {
  return getSnapshot(processId, timeConfig);
}

function getJvmSnapshot([hierachySnapshots$]) {
  return hierachySnapshots$.map(hierarchySnapshots =>
    getSnapshotWithPlugin(hierarchySnapshots, plugins.jvmRuntimePlatform)
  );
}

function getDeepestTechSnapshot([hierachy$, timeConfigForSnapshots]) {
  return hierachy$.flatMap(hierachy => getSnapshot(hierachy.get(0), timeConfigForSnapshots));
}

function getPhpSnapshot([hierachySnapshots$]) {
  return hierachySnapshots$.map(hierarchySnapshots =>
    getSnapshotWithPlugins(hierarchySnapshots, [plugins.phpFpmRuntimePlatform, plugins.phpRuntimePlatform])
  );
}

function spreadTimeConfig(timeConfig) {
  return [timeConfig.to, timeConfig.focusedMoment, timeConfig.windowSize, timeConfig.autoRefresh];
}
