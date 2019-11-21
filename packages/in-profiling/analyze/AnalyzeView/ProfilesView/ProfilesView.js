import { compose } from 'recompose';
import React from 'react';

import { processIdUrlParameter } from 'in-profiling/navigation/urlParameters';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import Breadcrumbs from 'in-sdk/components/dashboard/breadcrumb/Breadcrumbs';
import BasicDashboardHeader from 'in-new-components/BasicDashboardHeader';
import BreadcrumbHeader from 'in-components/breadcrumb/BreadcrumbHeader';
import { closeProfilesViewLink } from 'in-profiling/navigation/paths';
import tabs from 'in-profiling/analyze/AnalyzeView/ProfilesView/tabs';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import getProfiles from 'in-profiling/subscriptions/getProfiles';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import { isEntityOnline } from 'in-stores/snapshot';
import { getSnapshot } from 'in-stores/snapshot';
import withUrlState from 'in-hoc/withUrlState';
import Button from 'in-new-components/Button';
import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';
import { getLabel } from 'in-sdk/snapshot';
import Sticky from 'in-components/Sticky';
import connect from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import locals from './ProfilesView.mless';

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
  const { processSnapshot, isOnline, processId, timeConfig, tagFilters, location } = props;

  return (
    <>
      <Sticky header={<BreadcrumbHeader useFullAvailableWidth />}>
        <TabView
          // Discard all state when the process ID changes
          key={processId}
          HeaderComponent={Header}
          tabs={tabs}
          location={location}
          result$={getProfiles({ processSnapshotId: processId, tagFilters, filter: { timeConfig } })}
          withProps={({ result }) => ({
            profiles: result.data,
            processSnapshot,
            isOnline
          })}
          props={props}
          withoutBreadcrumb
          useFullAvailableWidth
          withoutPadding
        />
      </Sticky>
    </>
  );
}

function Header(props) {
  const label = `Profiles of Process ${props.processSnapshot ? getLabel(props.processSnapshot) : ''}`;

  return (
    <>
      <Breadcrumbs
        items={[
          <Breadcrumb label="Analyze profiles" href$={closeProfilesViewLink} />,
          props.result.data && <Breadcrumb label={label} />
        ].filter(Boolean)}
      />
      <BasicDashboardHeader
        title="Profiles of Process"
        icon="lib_actions_share"
        renderActions={Actions}
        getLabel={() => label}
        {...props}
      />
      <div className={locals.tabViewPlaceholder} />
    </>
  );
}

function Actions({ processId }) {
  return (
    <>
      <Button kind="secondary" href$={getDashboardLink(processId, { pathname: '/physical/dashboard' })}>
        View Infrastructure
      </Button>
      <Link href$={closeProfilesViewLink}>
        <Tooltip content="Close process details">
          <SvgIcon className={locals.closeIcon} aria-label="Close process details" type="lib_openclose_cancel" />
        </Tooltip>
      </Link>
    </>
  );
}
