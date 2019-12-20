import React, { useState } from 'react';
import { compose } from 'recompose';

import { getTagFilterListForBackendSubscription } from 'in-analyze/applicationFilter';
import { processIdUrlParameter } from 'in-profiling/navigation/urlParameters';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import { closeProfilesViewLink } from 'in-profiling/navigation/paths';
import tabs from 'in-profiling/analyze/AnalyzeView/ProfilesView/tabs';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import getProfiles from 'in-profiling/subscriptions/getProfiles';
import DashboardHeader from 'in-new-components/DashboardHeader';
import { generateUniqueShortId } from 'in-services/util/id';
import { isEntityOnline } from 'in-stores/snapshot';
import { getSnapshot } from 'in-stores/snapshot';
import withUrlState from 'in-hoc/withUrlState';
import Button from 'in-new-components/Button';
import { getLabel } from 'in-sdk/snapshot';
import connect from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import locals from './ProfilesView.mless';

export const viewTypes = {
  flameGraph: 'flameGraph',
  table: 'table'
};

export default compose(
  withUrlState({
    bind: [processIdUrlParameter]
  }),
  connect(({ processId, timeConfig }) => ({
    processSnapshot: getSnapshot(processId, timeConfig),
    isOnline: isEntityOnline(processId)
  }))
)(ProfilesView);

function ProfilesView(props) {
  // will be mounted in the header as soon as they are refactored
  const [viewType, setViewType] = useState(viewTypes.flameGraph);

  const { processSnapshot, isOnline, processId, timeConfig, tagFilters, location } = props;

  return (
    <TabView
      // Discard all state when the process ID changes
      key={processId}
      HeaderComponent={Header}
      tabs={tabs}
      location={location}
      result$={getProfiles({
        processSnapshotId: processId,
        tagFilters: getTagFilterListForBackendSubscription(tagFilters),
        filter: { timeConfig }
      }).map(addUniqueIdToProfilesIfPresent)}
      withProps={({ result }) => ({
        viewType,
        setViewType,
        profiles: result.data,
        processSnapshot,
        isOnline
      })}
      props={props}
      withoutBreadcrumb
      withoutPadding
    />
  );
}

function Header(props) {
  const label = `Profiles of Process ${props.processSnapshot ? getLabel(props.processSnapshot) : ''}`;

  return (
    <DashboardHeader
      {...props}
      title="Profiles of Process"
      icon="lib_profiling"
      label={label}
      renderButtonLine={renderButtonLine}
      contextConfigurations={[{ renderContext, contextIcon: 'lib_profiling' }]}
    />
  );
}

function renderButtonLine({ processId }) {
  return (
    <Button kind="secondary" href$={getDashboardLink(processId, { pathname: '/physical/dashboard' })}>
      View Infrastructure
    </Button>
  );
}

function renderContext() {
  return (
    <Link className={locals.contextLink} href$={closeProfilesViewLink}>
      Analyze profiles
    </Link>
  );
}

function addUniqueIdToProfilesIfPresent(result) {
  if (!result.data) {
    return result;
  }

  const newResult = { errors: result.errors, progress: result.progress, data: {} };
  if (result.data.cpuProfile) {
    newResult.data.cpuProfile = { ...result.data.cpuProfile, __uid: generateUniqueShortId() };
  }
  if (result.data.memoryProfile) {
    newResult.data.memoryProfile = { ...result.data.memoryProfile, __uid: generateUniqueShortId() };
  }
  if (result.data.timeProfile) {
    newResult.data.timeProfile = { ...result.data.timeProfile, __uid: generateUniqueShortId() };
  }
  return newResult;
}
