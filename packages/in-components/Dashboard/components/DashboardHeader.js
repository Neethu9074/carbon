import React from 'react';

import HealthIndicatorButtonPresenter from 'in-new-components/health/HealthIndicatorButtonPresenter';
import AnalyzeProfilesButton from 'in-components/Dashboard/components/AnalyzeProfilesButton';
import DashboardBreadcrumb from 'in-components/Dashboard/components/DashboardBreadcrumb';
import EntityVersionButton from 'in-components/Dashboard/components/EntityVersionButton';
import { getShowZoneInSidebarHeader, getDashboardHeaderActions } from 'in-sdk/snapshot';
import EntityHealthIndicator from 'in-new-components/EntityHealthIndicator';
import PluginBadge from 'in-components/Dashboard/components/PluginBadge';
import DashboardHeaderComponent from 'in-new-components/DashboardHeader';
import ContextGuide from 'in-new-components/ContextGuide/ContextGuide';
import ZoneTag from 'in-components/MapSidebar/components/ZoneTag';
import PluginIcon from 'in-components/PluginIcon';
import { plugins } from 'in-forge/constants';

import locals from './DashboardHeader.mless';

export default function DashboardHeader(props) {
  const { snapshot, title, snapshotId } = props;
  return (
    <>
      <DashboardBreadcrumb snapshotId={snapshotId} snapshot={snapshot} title={title} />
      <div className={locals.dashboardHeader}>
        <DashboardHeaderComponent
          {...props}
          title={title}
          snapshot={snapshot}
          renderIcon={() => <PluginIcon className={locals.icon} snapshot={snapshot} size="l" />}
          label={snapshot.get('label')}
          renderButtonLine={renderButtonLine}
          renderMetaInformation={renderMetaInformation}
        />
      </div>
    </>
  );
}

function renderButtonLine({ snapshot, timeConfig }) {
  return (
    <>
      <EntityHealthIndicator
        IndicatorPresenter={HealthIndicatorButtonPresenter}
        snapshotId={snapshot.get('id')}
        timeConfig={timeConfig}
      />
      {![plugins.instanaAgent, plugins.prometheus, plugins.availabilityZone, plugins.genericZone].includes(
        snapshot.get('plugin')
      ) && (
        <ContextGuide id={snapshot.get('id')} timeConfig={timeConfig} tagFilters={getSnapshotIdTagFilter(snapshot)} />
      )}
      {getDashboardHeaderActions(snapshot, timeConfig)}
      <EntityVersionButton snapshotId={snapshot.get('id')} timeConfig={timeConfig} />
      {snapshot.get('plugin') === plugins.process && (
        <AnalyzeProfilesButton processSnapshotId={snapshot.get('id')} timeConfig={timeConfig} />
      )}
    </>
  );
}

function renderMetaInformation({ snapshot, plugin }) {
  return (
    <>
      <PluginBadge plugin={plugin} />
      {getShowZoneInSidebarHeader(plugin) && <ZoneTag snapshotId={snapshot.get('id')} />}
    </>
  );
}

function getSnapshotIdTagFilter(snapshot) {
  const plugin = snapshot.get('plugin');
  const id = snapshot.get('id');
  if (plugin === 'host') {
    return [{ name: 'host.snapshotId', value: id, operator: 'EQUALS' }];
  } else if (
    plugin === 'docker' ||
    plugin === 'crio' ||
    plugin === 'garden' ||
    plugin === 'containerd' ||
    plugin === 'awsEcsContainer'
  ) {
    return [{ name: 'container.snapshotId', value: id, operator: 'EQUALS' }];
  } else if (plugin === 'awsRds') {
    return [{ name: 'cloud.snapshotId', value: id, operator: 'EQUALS' }];
  } else {
    return [{ name: 'process.snapshotId', value: id, operator: 'EQUALS' }];
  }
}
