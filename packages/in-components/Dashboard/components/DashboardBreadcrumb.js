import React, { Fragment } from 'react';

import WithInfrastructureHealthIndicationBehaviour from 'in-components/health/WithHealthIndication/WithInfrastructureHealthIndicationBehaviour';
import { isInternalVisible$ } from 'in-new-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import { getCloseDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import { selectedSnapshotId$, getPhysicalHierarchy } from 'in-stores/snapshot';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import Breadcrumbs from 'in-sdk/components/dashboard/breadcrumb/Breadcrumbs';
import Breadcrumb from 'in-sdk/components/dashboard/breadcrumb/Breadcrumb';
import BreadcrumbHeader from 'in-components/breadcrumb/BreadcrumbHeader';
import getAgentSnapshotId from 'in-subscription/getAgentSnapshotId';
import { kubernetesEnabled } from 'in-services/featureFlags';
import { getLabel, getIconSvgPath } from 'in-sdk/snapshot';
import { alwaysNull } from 'in-services/fixedStreams';
import { getSnapshot } from 'in-stores/snapshot';
import { getSingular } from 'in-sdk/pluginName';
import connectTo from 'in-hoc/connectTo';

import locals from './DashboardBreadcrumb.mless';

export default connectTo(
  props => ({
    physicalHierarchy: getPhysicalHierarchy({
      snapshotId: props.snapshotId,
      // When Kuberentes is enabled, then our story is a bit different. We deliberately
      // do not want to include it within the breadcrumb
      includeKubernetes: !kubernetesEnabled
    }).map(_physicalHierarchy => {
      _physicalHierarchy = _physicalHierarchy.toArray();
      _physicalHierarchy.reverse();
      return _physicalHierarchy;
    }),
    closeDashboardLink: getCloseDashboardLink(),
    agent: isInternalVisible$.flatMap(enabled => (enabled ? getAgentSnapshotId(props.snapshot) : alwaysNull))
  }),
  function DashboardBreadcrumb({ physicalHierarchy, snapshotId, closeDashboardLink, agent }) {
    if (!physicalHierarchy) {
      return null;
    }

    if (physicalHierarchy.length === 0) {
      physicalHierarchy.unshift(snapshotId);
    }

    const items = physicalHierarchy.map(id => <PhysicalHierarchyBreadCrumb key={id} snapshotId={id} />);
    if (agent) {
      items.unshift(<PhysicalHierarchyBreadCrumb snapshotId={agent} />);
    }
    items.unshift(
      <Breadcrumb className={locals.homeBreadcrumb} href={closeDashboardLink}>
        {getHomeBreadcrumb(closeDashboardLink)}
      </Breadcrumb>
    );

    return (
      <Fragment>
        <BreadcrumbHeader useFullAvailableWidth automaticActiveState={false} />
        <Breadcrumbs items={items} />
      </Fragment>
    );
  }
);

const PhysicalHierarchyBreadCrumb = connectTo(
  props => ({
    snapshot: getSnapshot(props.snapshotId),
    isActive: selectedSnapshotId$.map(id => id === props.snapshotId)
  }),
  function PhysicalHierarchyBreadCrumb({ snapshot, snapshotId, isActive }) {
    if (!snapshot) {
      return null;
    }

    const plugin = snapshot.get('plugin');
    return (
      <WithInfrastructureHealthIndicationBehaviour
        snapshotId={snapshotId}
        render={healthInfo => (
          <Breadcrumb
            href$={getDashboardLink(snapshotId)}
            label={getSingular(plugin)}
            iconPath={getIconSvgPath(snapshot)}
            isActive={isActive}
            healthInfo={healthInfo}
          >
            {getLabel(snapshot)}
          </Breadcrumb>
        )}
      />
    );
  }
);

function getHomeBreadcrumb(closeDashboardLink) {
  if (closeDashboardLink.includes('#/table')) {
    return 'Comparison Table';
  } else if (closeDashboardLink.includes('#/agents')) {
    return 'Agents';
  }
  return 'Map';
}
