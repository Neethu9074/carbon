/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import {
  useAbapInstanceDashboard,
  useAbapCentralInstanceDashboard,
  useSapDbInstanceDashboard,
  useSapDbmsDashboard,
  useSapDbTenantDashboard,
  useSapHanaDashboard,
  useSapJavaCentralInstanceDashboard,
  useSapJavaInstanceDashboard,
  useAbapSystemDashboard,
  useSapJavaSystemDashboard,
  useSapHanaSystemDashboard,
  useSapWebDispatcherDashboard,
  useSapAbapInstanceSensorDashboard,
  useSapAbapSystemSensorDashboard,
  useSapJavaNetWeaverInstanceSensorDashboard,
  useSapJavaNetWeaverSystemSensorDashboard
} from 'in-sap/navigation/paths';
import { useGetDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import { getIconType } from 'in-infrastructure/infrastructureIconType';
import EntityLink from 'in-components/EntityLink/EntityLink';
import { plugins } from 'in-forge/constants';

const DashboardLink = ({ label, id }) => {
  const href = useGetDashboardLink()(id, { pathname: '/physical/dashboard' });
  return <EntityLink label={label} href={href} />;
};

export const GetSpecificDashboard = function ({ value, matrixPrefix, systemSnapshotId }) {
  const getAbapCentralInstanceDashboard = useAbapCentralInstanceDashboard;
  const getAbapInstanceDashboard = useAbapInstanceDashboard;
  const getAbapSystemDashboard = useAbapSystemDashboard;
  const getSapJavaSystemDashboard = useSapJavaSystemDashboard;
  const getSapJavaInstanceDashboard = useSapJavaInstanceDashboard;
  const getSapJavaCentralInstanceDashboard = useSapJavaCentralInstanceDashboard;
  const getSapHanaSystemDashboard = useSapHanaSystemDashboard;
  const getSapWebDispatcherDashboard = useSapWebDispatcherDashboard;
  const getSapDbmsDashboard = useSapDbmsDashboard;
  const getSapHanaDashboard = useSapHanaDashboard;
  const getSapDbTenantDashboard = useSapDbTenantDashboard;
  const getSapDbInstanceDashboard = useSapDbInstanceDashboard;
  const getSapAbapInstanceSensorDashboard = useSapAbapInstanceSensorDashboard;
  const getSapAbapSystemSensorDashboard = useSapAbapSystemSensorDashboard;
  const getSapJavaNetWeaverInstanceSensorDashboard = useSapJavaNetWeaverInstanceSensorDashboard;
  const getSapJavaNetWeaverSystemSensorDashboard = useSapJavaNetWeaverSystemSensorDashboard;
  switch (value.pluginName) {
    case plugins.abapInstance:
      if (value.label.includes('Central'))
        return (
          <EntityLink
            label={value.label}
            href={getAbapCentralInstanceDashboard(value.id, matrixPrefix, systemSnapshotId)}
            icon={getIconType(value.pluginName)}
          />
        );
      else
        return (
          <EntityLink
            label={value.label}
            href={getAbapInstanceDashboard(value.id, matrixPrefix, systemSnapshotId)}
            icon={getIconType(value.pluginName)}
          />
        );
    case plugins.sapDbInstance:
      return (
        <EntityLink
          label={value.label}
          href={getSapDbInstanceDashboard(value.id, matrixPrefix, systemSnapshotId)}
          icon={getIconType(value.pluginName)}
        />
      );
    case plugins.sapDbms:
      return (
        <EntityLink
          label={value.label}
          href={getSapDbmsDashboard(value.id, matrixPrefix, systemSnapshotId)}
          icon={getIconType(value.pluginName)}
        />
      );
    case plugins.sapDbTenant:
      return (
        <EntityLink
          label={value.label}
          href={getSapDbTenantDashboard(value.id, matrixPrefix, systemSnapshotId)}
          icon={getIconType(value.pluginName)}
        />
      );
    case plugins.sapHanaPlatform:
      return (
        <EntityLink
          label={value.label}
          href={getSapHanaDashboard(value.id, matrixPrefix, systemSnapshotId)}
          icon={getIconType(value.pluginName)}
        />
      );
    case plugins.sapJavaInstance:
      if (value.label.includes('Central'))
        return (
          <EntityLink
            label={value.label}
            href={getSapJavaCentralInstanceDashboard(value.id, matrixPrefix, systemSnapshotId)}
            icon={getIconType(value.pluginName)}
          />
        );
      else
        return (
          <EntityLink
            label={value.label}
            href={getSapJavaInstanceDashboard(value.id, matrixPrefix, systemSnapshotId)}
            icon={getIconType(value.pluginName)}
          />
        );
    case plugins.sapHanaSystem:
      return (
        <EntityLink
          label={value.label}
          href={getSapHanaSystemDashboard(value.id, matrixPrefix, systemSnapshotId)}
          icon={getIconType(value.pluginName)}
        />
      );
    case plugins.sapWebDispatcher:
      return (
        <EntityLink
          label={value.label}
          href={getSapWebDispatcherDashboard(value.id, matrixPrefix, systemSnapshotId)}
          icon={getIconType(value.pluginName)}
        />
      );
    case plugins.sapJavaSystem:
      return (
        <EntityLink
          label={value.label}
          href={getSapJavaSystemDashboard(value.id, matrixPrefix, systemSnapshotId)}
          icon={getIconType(value.pluginName)}
        />
      );
    case plugins.abapSystem:
      return (
        <EntityLink
          label={value.label}
          href={getAbapSystemDashboard(value.id, matrixPrefix, systemSnapshotId)}
          icon={getIconType(value.pluginName)}
        />
      );
    case plugins.sapAbapInstanceSensor:
      return (
        <EntityLink
          label={value.label}
          href={getSapAbapInstanceSensorDashboard(value.id, matrixPrefix, systemSnapshotId)}
          icon={getIconType(value.pluginName)}
        />
      );
    case plugins.sapAbapSystemSensor:
      return (
        <EntityLink
          label={value.label}
          href={getSapAbapSystemSensorDashboard(value.id, matrixPrefix, systemSnapshotId)}
          icon={getIconType(value.pluginName)}
        />
      );
    case plugins.sapJavaNetWeaverInstanceSensor:
      return (
        <EntityLink
          label={value.label}
          href={getSapJavaNetWeaverInstanceSensorDashboard(value.id, matrixPrefix, systemSnapshotId)}
          icon={getIconType(value.pluginName)}
        />
      );
    case plugins.sapJavaNetWeaverSystemSensor:
      return (
        <EntityLink
          label={value.label}
          href={getSapJavaNetWeaverSystemSensorDashboard(value.id, matrixPrefix, systemSnapshotId)}
          icon={getIconType(value.pluginName)}
        />
      );
    default:
      return <DashboardLink label={value.label} id={value.id} />;
  }
};
