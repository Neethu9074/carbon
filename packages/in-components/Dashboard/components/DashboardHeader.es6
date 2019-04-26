import React, { Fragment } from 'react';

import HealthIndicatorButtonPresenter from 'in-new-components/health/HealthIndicatorButtonPresenter';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import DashboardBreadcrumb from 'in-components/Dashboard/components/DashboardBreadcrumb';
import { getCloseDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import TimeSelection from 'in-new-components/time/TimeSelection/TimeSelection';
import EntityHealthIndicator from 'in-new-components/EntityHealthIndicator';
import BasicDashboardHeader from 'in-new-components/BasicDashboardHeader';
import PluginBadge from 'in-components/Dashboard/components/PluginBadge';
import ZoneTag from 'in-components/MapSidebar/components/ZoneTag';
import { getShowZoneInSidebarHeader } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';

import locals from './DashboardHeader.mless';

export default connectTo(
  {
    closeDashboardLink: getCloseDashboardLink()
  },
  function DashboardHeader(props) {
    const { snapshot, title, snapshotId } = props;
    return (
      <Fragment>
        <div className={locals.header}>
          <MaxWidthFullscreenContainer>
            <DashboardBreadcrumb snapshotId={snapshotId} />
            <TimeSelection />
          </MaxWidthFullscreenContainer>
        </div>
        <div className={locals.dashboardHeader}>
          <MaxWidthFullscreenContainer>
            <BasicDashboardHeader
              title={title}
              pluginIcon={snapshot}
              renderActions={Actions}
              renderSubTypes={SubTypes}
              {...props}
            />
          </MaxWidthFullscreenContainer>
        </div>
      </Fragment>
    );
  }
);

function Actions({ snapshot, timeConfig }) {
  return (
    <EntityHealthIndicator
      showOkayOnNoIssues={false}
      IndicatorPresenter={HealthIndicatorButtonPresenter}
      snapshotId={snapshot.get('id')}
      timeConfig={timeConfig}
    />
  );
}

function SubTypes({ snapshot, plugin }) {
  return (
    <Fragment>
      <PluginBadge plugin={plugin} />
      {getShowZoneInSidebarHeader(plugin) && <ZoneTag snapshotId={snapshot.get('id')} />}
    </Fragment>
  );
}
