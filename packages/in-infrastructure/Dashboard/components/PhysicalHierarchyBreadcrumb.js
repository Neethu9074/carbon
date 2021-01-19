/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import WithInfrastructureHealthIndicationBehaviour from 'in-components/health/WithHealthIndication/WithInfrastructureHealthIndicationBehaviour';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import { getIconType } from 'in-components/SvgIcon/infrastructureIconType';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import Skeleton from 'in-new-components/Loading/Skeleton';
import { getSnapshot } from 'in-stores/snapshot';
import { getSingular } from 'in-sdk/pluginName';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';

import locals from './PhysicalHierarchyBreadcrumb.mless';

export default connectTo(
  ({ snapshotId }) => ({
    snapshot: getSnapshot(snapshotId)
  }),
  function PhysicalHierarchyBreadcrumb({ snapshot, snapshotId, isActive, asLink = true, className }) {
    if (!snapshot) {
      return (
        <Breadcrumb>
          <Skeleton className={locals.skeleton} />
        </Breadcrumb>
      );
    }

    const plugin = snapshot.get('plugin');
    return (
      <WithInfrastructureHealthIndicationBehaviour
        snapshotId={snapshotId}
        render={healthInfo => (
          <Breadcrumb
            className={className}
            href$={asLink && getDashboardLink(snapshotId)}
            label={getSingular(plugin)}
            icon={getIconType(snapshot)}
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
