import React from 'react';

import { getApplicationDashboard, getServiceDashboard } from 'in-applications/navigation/paths';
import getProfilesAvailable from 'in-profiling/subscriptions/getProfilesAvailable';
import { physicalDashboardPath } from 'in-stores/navigation/paths/mainPaths';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import EntityWithTypeAndIcon from 'in-new-components/EntityWithTypeAndIcon';
import { profilingEnabled } from 'in-services/featureFlags';
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

export default function StackItem({ item: { id, type, label }, area }) {
  const kpiDefinitions = getKpiDefinitions(type);
  const isInfra = area === 'infrastructure';

  return (
    <Li href$={dashboardLink(id, area, type)}>
      <div className={locals.itemWrapper}>
        <EntityWithTypeAndIcon
          type={type}
          renderType={profilingEnabled && type === plugins.process ? label => renderType(id, label) : undefined}
          label={label}
          iconPath={getIconSvgPath(type)}
        />
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

function renderType(id, label) {
  return <RenderType id={id} label={label} />;
}

const RenderType = connectTo(({ id }) => ({
  profilesAvailable: timeConfig$
    .flatMap(timeConfig =>
      getProfilesAvailable({
        processSnapshotId: id,
        timeConfig
      })
    )
    .map(result => result.data && result.data.containsProfiles)
}))(function RenderType({ label, profilesAvailable }) {
  return (
    <>
      {label}
      {profilesAvailable && (
        <Tooltip content="Profiles available">
          <SvgIcon className={locals.icon} type="lib_profiling" size="xxs" />
        </Tooltip>
      )}
    </>
  );
});
