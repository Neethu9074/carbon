/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { SvgIcon, KeyValue } from '@instana/components';

import { getApplicationDashboard, getServiceDashboard, getEndpointDashboard } from 'in-applications/navigation/paths';
import EndpointTypeBadgeList from 'in-applications/Dashboards/commonComponents/EndpointTypeBadgeList';
import { getDashboardForEntity as getDashboardForK8sEntity } from 'in-kubernetes/navigation/paths';
import getProfilesAvailable from 'in-new-components/Profiling/subscriptions/getProfilesAvailable';
import { physicalDashboardPath } from 'in-stores/navigation/paths/mainPaths';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import HealthDot from 'in-new-components/health/HealthDot/HealthDot';
import SEVERITY_MAP from 'in-new-components/Stack/severity.json';
import EntityWithIcon from 'in-new-components/EntityWithIcon';
import { getKpiDefinitions } from 'in-sdk/metrics/kpis';
import apKpis from 'in-new-components/Stack/apKpis';
import { timeConfig$ } from 'in-stores/time/config';
import KpiChart from 'in-new-components/KpiChart';
import { Li } from 'in-new-components/lists/List';
import { plugins } from 'in-forge/constants';
import Tooltip from 'in-components/Tooltip';
import connectTo from 'in-hoc/connectTo';

import locals from './StackItem.mless';

export default function StackItem({
  applicationId,
  boundaryScope,
  serviceId,
  syntheticCalls,
  item: { id, type, label, shortLabel, healthInfo, metrics, endpointTypes, technologies },
  tab
}) {
  const isAp = tab === 'application';
  const hasHealthInfo = healthInfo?.type;
  const technologiesNoK8s = technologies?.filter(s => !s.startsWith('kubernetes') || !s.startsWith('openshift'));

  return (
    <Li href$={dashboardLink(id, applicationId, boundaryScope, serviceId, type, syntheticCalls)} noAlternatingBg>
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
          <EntityWithIcon
            label={shortLabel || label}
            type={type}
            technologies={technologiesNoK8s}
            length={100}
            size="regular"
          />

          {!isAp && type === plugins.process && <ProfileIndicator processSnapshotId={id} />}
          {showEndpointTypes(endpointTypes)}
        </div>
        {isAp ? showApKpis(metrics) : showInfraKpis(id, type)}
      </div>
    </Li>
  );
}

const dashboardLink = (id, applicationId, boundaryScope, serviceId, type, syntheticCalls) => {
  if (type === 'application') {
    return getApplicationDashboard(id, { boundaryScope, syntheticCalls });
  } else if (type === 'service') {
    return getServiceDashboard(id, {
      applicationId,
      boundaryScope,
      syntheticCalls
    });
  } else if (type === 'endpoint') {
    return getEndpointDashboard(id, {
      applicationId,
      boundaryScope,
      serviceId,
      syntheticCalls
    });
  }

  const link = getDashboardForK8sEntity(id, type);
  if (link) {
    return link;
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

const showApKpis = metrics => {
  if (!metrics) {
    return null;
  }

  return (
    <div className={locals.chartWrapper}>
      {apKpis
        .filter(kpi => metrics[kpi.key])
        .slice(0, 2)
        .map(({ label, formatter, key }) => {
          return (
            <KeyValue
              key={key}
              className={locals.chart}
              label={label}
              value={formatter(metrics[key][0][1])}
              accentuated
            />
          );
        })}
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
