/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { LoadingSkeleton } from '@instana/components';

import WithInfrastructureHealthIndicationBehaviour from 'in-components/health/WithHealthIndication/WithInfrastructureHealthIndicationBehaviour';
import { useGetDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import { getIconType } from 'in-infrastructure/infrastructureIconType';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import { nonServicePlugins } from 'in-forge/constants';
import { getPluginName } from 'in-sdk/pluginName';
import { getSnapshot } from 'in-stores/snapshot';
import { plugins } from 'in-forge/constants';
import decamelize from 'in-sdk/decamelize';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';

import locals from './PhysicalHierarchyBreadcrumb.mless';

export default connectTo(
  ({ snapshotId }) => ({
    snapshot: getSnapshot(snapshotId)
  }),
  function PhysicalHierarchyBreadcrumb({ snapshot, snapshotId, isActive, asLink = true, className }) {
    const getDashboardLink = useGetDashboardLink();
    if (!snapshot) {
      return (
        <Breadcrumb>
          <LoadingSkeleton className={locals.skeleton} />
        </Breadcrumb>
      );
    }

    const rawPlugin = snapshot.get('plugin');
    const plugin = nonServicePlugins[rawPlugin];
    return (
      <WithInfrastructureHealthIndicationBehaviour
        snapshotId={snapshotId}
        render={healthInfo => (
          <Breadcrumb
            className={className}
            href={asLink && getDashboardLink(snapshotId)}
            label={getPluginName(plugin, 1) ?? decamelize(rawPlugin)}
            icon={snapshot?.get('plugin') === plugins.oTelDatabase ? getIconByPlugin(snapshot) : getIconType(snapshot)}
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
function getIconByPlugin(snapshot) {
  const data = snapshot?.get('data');
  const database = data?.get('resource.db.system')?.toLowerCase();
  switch (database) {
    case 'db2':
      return 'lib_infra_db2Database';
    case 'mysql':
      return 'lib_infra_mySqlDatabase';
    case 'mongodb':
      return 'lib_infra_mongoDb';
    case 'informix':
      return 'lib_infra_informix';
    default:
      return getIconType(snapshot);
  }
}
