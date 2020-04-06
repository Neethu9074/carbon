import React from 'react';

import EndpointTypeBadgeList from 'in-applications/Dashboards/commonComponents/EndpointTypeBadgeList';
import { getApplicationDashboard, getServiceDashboard } from 'in-applications/navigation/paths';
import getProfilesAvailable from 'in-profiling/subscriptions/getProfilesAvailable';
import { physicalDashboardPath } from 'in-stores/navigation/paths/mainPaths';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import HealthDot from 'in-new-components/health/HealthDot/HealthDot';
import KeyValue, { themes } from 'in-new-components/lists/KeyValue';
import SEVERITY_MAP from 'in-new-components/Stack/severity.json';
import EntityWithIcon from 'in-new-components/EntityWithIcon';
import { getKpiDefinitions } from 'in-sdk/metrics/kpis';
import { timeConfig$ } from 'in-stores/time/config';
import KpiChart from 'in-new-components/KpiChart';
import { Li } from 'in-new-components/lists/List';
import { plugins } from 'in-forge/constants';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import locals from './StackItem.mless';

export default function StackItem({
  item: { id, type, label, shortLabel, healthInfo, metrics, endpointTypes, technologies },
  tab
}) {
  const isAp = tab === 'application';
  const hasHealthInfo = healthInfo?.type;
  const technologiesNoK8s = technologies?.filter(s => !s.startsWith('kubernetes'));

  return (
    <Li href$={dashboardLink(id, type)} noAlternatingBg>
      <div className={locals.itemWrapper}>
        <div className={locals.label}>
          {hasHealthInfo ? (
            <HealthDot
              className={locals.dot}
              severity={SEVERITY_MAP[healthInfo.type]}
              explanation={healthInfo.explanation}
              iconSize={8}
            />
          ) : (
            <div className={locals.dot} />
          )}
          <EntityWithIcon label={shortLabel || label} type={type} technologies={technologiesNoK8s} length={52} />

          {!isAp && type === plugins.process && <ProfileIndicator processSnapshotId={id} />}
          {showEndpointTypes(endpointTypes)}
        </div>
        {isAp ? showApKpis(metrics) : showInfraKpis(id, type)}
      </div>
    </Li>
  );
}

const dashboardLink = (id, type) => {
  if (type === 'application') {
    return getApplicationDashboard(id);
  } else if (type === 'service') {
    return getServiceDashboard(id);
  }
  return getDashboardLink(id, { pathname: physicalDashboardPath });
};

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

const showEndpointTypes = endpointTypes => {
  return endpointTypes ? (
    <div className={locals.endpointTypes}>
      <EndpointTypeBadgeList types={endpointTypes} />
    </div>
  ) : (
    <div />
  );
};

const AP_KPIS = [{ key: 'callsAgg', label: 'Calls' }, { key: 'erroneousCalls', label: 'Erroneous Calls' }];

const showApKpis = metrics => {
  if (!metrics) {
    return null;
  }

  return (
    <div className={locals.chartWrapper}>
      {AP_KPIS.map(
        kpi =>
          metrics[kpi.key] && (
            <KeyValue
              key={kpi.key}
              className={locals.chart}
              label={kpi.label}
              value={metrics[kpi.key][0][1]}
              theme={themes.blue}
              accentuated
            />
          )
      )}
    </div>
  );
};

const showInfraKpis = (id, type) => {
  const kpiDefinitions = getKpiDefinitions(type);

  return (
    <div className={locals.chartWrapper}>
      {kpiDefinitions.map(props => (
        <KpiChart key={`${id}-${props.label}`} snapshotId={id} {...props} />
      ))}
    </div>
  );
};
