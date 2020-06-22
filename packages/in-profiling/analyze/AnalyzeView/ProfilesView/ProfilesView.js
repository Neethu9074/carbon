import { compose, withPropsOnChange } from 'recompose';
import { just } from 'reactive-observables';
import React, { useState } from 'react';

import { analyzeProfilePathFullyQualified, closeProfilesViewLink } from 'in-profiling/navigation/paths';
import { processIdUrlParameter, timeUrlParameter } from 'in-profiling/navigation/urlParameters';
import ContextGuide from 'in-new-components/ContextGuide/ContextGuide';
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
    bind: [processIdUrlParameter, timeUrlParameter]
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
      jvmSnapshot: jvmSnapshot$,
      historicalProcessSnapshot: getSnapshot(processId, timeConfigForSnapshots),
      processSnapshot: getSnapshot(processId, timeConfig),

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
    location
  } = props;

  return (
    <TabView
      // Discard all state when the process ID changes
      key={processId}
      HeaderComponent={Header}
      tabs={tabs}
      location={location}
      result$={getProfiles({
        processSnapshotId: processId,
        filter: { timeConfig }
      }).distinct()}
      withProps={({ result }) => ({
        viewType,
        setViewType,
        profiles: result.data,
        processSnapshot,
        deepestTechSnapshot: deepestTechSnapshot || processSnapshot || historicalProcessSnapshot,
        jvmSnapshot,
        canFetchSourceCode
      })}
      basePath={analyzeProfilePathFullyQualified}
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
      title="Profiles of Process"
      icon="lib_profiling"
      label={label}
      renderButtonLine={renderButtonLine}
      contextConfigurations={[{ renderContext, contextIcon: 'lib_analyze_inverted' }]}
    />
  );
}

function renderButtonLine({ processId, timeConfig }) {
  return <ContextGuide id={processId} timeConfig={timeConfig} />;
}

function renderContext() {
  return (
    <Link className={locals.contextLink} href$={closeProfilesViewLink}>
      Analyze profiles
    </Link>
  );
}
