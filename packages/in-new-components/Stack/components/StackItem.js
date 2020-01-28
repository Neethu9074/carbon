import React from 'react';

import { getApplicationDashboard, getServiceDashboard } from 'in-applications/navigation/paths';
import { physicalDashboardPath } from 'in-stores/navigation/paths/mainPaths';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import EntityWithTypeAndIcon from 'in-new-components/EntityWithTypeAndIcon';
import { getKpiDefinitions } from 'in-sdk/metrics/kpis';
import KpiChart from 'in-new-components/KpiChart';
import { Li } from 'in-new-components/lists/List';
import { getIconSvgPath } from 'in-sdk/snapshot';

import locals from './StackItem.mless';

export default function StackItem({ item: { id, type, label }, area }) {
  const kpiDefinitions = getKpiDefinitions(type);
  const isInfra = area === 'infrastructure';

  return (
    <Li href$={dashboardLink(id, type)}>
      <div className={locals.itemWrapper}>
        <EntityWithTypeAndIcon label={label} iconPath={getIconSvgPath(type)} addEllipsis={isInfra} addTooltip />
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
