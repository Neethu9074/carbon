import React, { Fragment } from 'react';

import { getCloseDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import Breadcrumbs from 'in-sdk/components/dashboard/breadcrumb/Breadcrumbs';
import Breadcrumb from 'in-sdk/components/dashboard/breadcrumb/Breadcrumb';
import BreadcrumbHeader from 'in-components/breadcrumb/BreadcrumbHeader';
import { kubernetesEnabled } from 'in-services/featureFlags';
import { getLabel, getIconSvgPath } from 'in-sdk/snapshot';
import { getPhysicalHierarchy } from 'in-stores/snapshot';
import { getSnapshot } from 'in-stores/snapshot';
import { getSingular } from 'in-sdk/pluginName';
import connectTo from 'in-hoc/connectTo';

import locals from './DashboardBreadcrumb.mless';

export default connectTo(
  props => ({
    physicalHierarchy: getPhysicalHierarchy({
      snapshotId: props.snapshotId,
      includeKubernetes: kubernetesEnabled ? false : true
    }).map(_physicalHierarchy => {
      _physicalHierarchy = _physicalHierarchy.toArray();
      _physicalHierarchy.reverse();
      return _physicalHierarchy;
    }),
    closeDashboardLink: getCloseDashboardLink()
  }),
  function DashboardBreadcrumb({ physicalHierarchy, snapshotId, closeDashboardLink }) {
    if (!physicalHierarchy) {
      return null;
    }

    if (physicalHierarchy.length === 0) {
      physicalHierarchy.unshift(snapshotId);
    }

    const items = physicalHierarchy.map(id => <PhysicalHierarchyBreadCrumb key={id} snapshotId={id} />);
    items.unshift(
      <Breadcrumb className={locals.homeBreadcrumb} href={closeDashboardLink}>
        {getHomeBreadcrumb(closeDashboardLink)}
      </Breadcrumb>
    );

    return (
      <Fragment>
        <BreadcrumbHeader useFullAvailableWidth />
        <Breadcrumbs items={items} />
      </Fragment>
    );
  }
);

const PhysicalHierarchyBreadCrumb = connectTo(
  props => ({
    snapshot: getSnapshot(props.snapshotId)
  }),
  function PhysicalHierarchyBreadCrumb({ snapshot, snapshotId }) {
    if (!snapshot) {
      return null;
    }

    const plugin = snapshot.get('plugin');
    return (
      <Breadcrumb href$={getDashboardLink(snapshotId)} label={getSingular(plugin)} iconPath={getIconSvgPath(snapshot)}>
        {getLabel(snapshot)}
      </Breadcrumb>
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
