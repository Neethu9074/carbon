import React from 'react';

import HealthIndicatorButtonPresenter from 'in-new-components/health/HealthIndicatorButtonPresenter';
import DashboardBreadcrumb from 'in-components/Dashboard/components/DashboardBreadcrumb';
import EntityVersionButton from 'in-components/Dashboard/components/EntityVersionButton';
import { getShowZoneInSidebarHeader, getDashboardHeaderActions } from 'in-sdk/snapshot';
import EntityHealthIndicator from 'in-new-components/EntityHealthIndicator';
import PluginBadge from 'in-components/Dashboard/components/PluginBadge';
import DashboardHeaderComponent from 'in-new-components/DashboardHeader';
import ZoneTag from 'in-components/MapSidebar/components/ZoneTag';
import StackButton from 'in-new-components/Stack/StackButton';
import PluginIcon from 'in-components/PluginIcon';

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
        showOkayOnNoIssues={false}
        IndicatorPresenter={HealthIndicatorButtonPresenter}
        snapshotId={snapshot.get('id')}
        timeConfig={timeConfig}
      />
      <StackButton id={snapshot.get('id')} timeConfig={timeConfig} />
      {getDashboardHeaderActions(snapshot, timeConfig)}
      <EntityVersionButton snapshotId={snapshot.get('id')} timeConfig={timeConfig} />
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
