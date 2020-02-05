import React from 'react';

import { getApplicationDashboard, getServiceDashboard } from 'in-applications/navigation/paths';
import getProfilesAvailable from 'in-profiling/subscriptions/getProfilesAvailable';
import { physicalDashboardPath } from 'in-stores/navigation/paths/mainPaths';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import EntityWithTypeAndIcon from 'in-new-components/EntityWithTypeAndIcon';
import { getKpiDefinitions } from 'in-sdk/metrics/kpis';
import { timeConfig$ } from 'in-stores/time/config';
import KpiChart from 'in-new-components/KpiChart';
import { Li } from 'in-new-components/lists/List';
import { getIconSvgPath } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import locals from './StackItem.mless';

export default function StackItem({ item: { id, type, label }, tab }) {
  const kpiDefinitions = getKpiDefinitions(type);
  const isInfra = tab === 'infrastructure';

  return (
    <Li href$={dashboardLink(id, type)}>
      <div className={locals.itemWrapper}>
        <div className={locals.label}>
          <EntityWithTypeAndIcon label={label} iconPath={getIconSvgPath(type)} addEllipsis={isInfra} addTooltip />
          {isInfra && type === plugins.process && <ProfileIndicator processSnapshotId={id} />}
        </div>
        {isInfra ? (
          <div className={locals.chartWrapper}>
            {kpiDefinitions.map(props => (
              <KpiChart key={`${id}-${props.label}`} snapshotId={id} {...props} />
            ))}
          </div>
        ) : null}
      </div>
    </Li>
  );
}

function dashboardLink(id, type) {
  if (type === 'application') {
    return getApplicationDashboard(id);
  } else if (type === 'service') {
    return getServiceDashboard(id);
  }
  return getDashboardLink(id, { pathname: physicalDashboardPath });
}

const ProfileIndicator = connectTo(
  ({ processSnapshotId }) => ({
    profilesAvailable: timeConfig$.flatMap(timeConfig =>
      getProfilesAvailable({
        processSnapshotId,
        timeConfig
      }).map(result => result.data && result.data.containsProfiles)
    )
  }),
  function ProfileIndicator({ profilesAvailable }) {
    if (!profilesAvailable) {
      return null;
    }
    return (
      <Tooltip content="Profiles are available" align="rightMiddle">
        <SvgIcon className={locals.profileIcon} type="lib_profiling" size="xs" />
      </Tooltip>
    );
  }
);
