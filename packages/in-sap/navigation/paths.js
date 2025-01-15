/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { hostId as matrixHostId, systemSnapShotPrefix } from 'in-sap/navigation/matrix';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { systemPrefix } from 'in-sap/navigation/matrix';
import { emptyObject } from 'in-services/fixedObjects';
import { setTimeConfig } from 'in-stores/time/config';
import { plugins } from 'in-forge/constants';

export const sap = '/sap';

export const sapHostList = '/hosts';
export const sapSystemsList = '/sapsystemslist';
export const sapInstanceList = '/sapinstancelist';
export const sapDbInstanceList = '/sapdbinstancelist';
export const sapHostListFullyQualified = `${sap}${sapHostList}`;
export const sapSystemListFullyQualified = `${sap}${sapSystemsList}`;
export const sapInstanceListFullyQualified = `${sap}${sapInstanceList}`;
export const sapDbInstanceListFullyQualified = `${sap}${sapDbInstanceList}`;
export const sapHostDashboard = `/sapdash`;
export const abapInstanceDashboard = `/abapinstance`;
export const abapCentralInstanceDashboard = `/abapcentralinstance`;
export const abapSystemDashboard = `/abapsystem`;
export const sapDbmsDashboard = `/sapdbms`;
export const sapHanaDashboard = `/saphana`;
export const sapJavaSystemDashboard = `/sapjavasystem`;
export const sapHanaSystemDashboard = `/saphanasystem`;
export const sapWebDispatcherDashboard = `/sapwebdispatcher`;
export const sapAbapInstanceSensorDashboard = `/sapabapjcoinstance`;
export const sapAbapSystemSensorDashboard = `/sapabapjcosystem`;
export const sapJavaInstanceDashboard = `/sapjavainstance`;
export const sapJavaCentralInstanceDashboard = `/sapjavacentralinstance`;
export const sapDbInstanceDashboard = `/sapdbinstance`;
export const sapDbTenantDashboard = `/sapdbtenant`;
export const sapHostDashboardFullyQualified = `${sap}${sapHostList}`;
export const abapInstanceDashboardFullyQualified = `${sap}${abapInstanceDashboard}`;
export const abapSystemDashboardFullyQualified = `${sap}${abapSystemDashboard}`;
export const sapDbmsDashboardFullyQualified = `${sap}${sapDbmsDashboard}`;
export const sapHanaDashboardFullyQualified = `${sap}${sapHanaDashboard}`;
export const sapJavaSystemDashboardFullyQualified = `${sap}${sapJavaSystemDashboard}`;
export const sapHanaSystemDashboardFullyQualified = `${sap}${sapHanaSystemDashboard}`;
export const sapWebDispatcherDashboardFullyQualified = `${sap}${sapWebDispatcherDashboard}`;
export const sapAbapInstanceSensorDashboardFullyQualified = `${sap}${sapAbapInstanceSensorDashboard}`;
export const sapAbapSystemSensorDashboardFullyQualified = `${sap}${sapAbapSystemSensorDashboard}`;
export const sapJavaInstanceDashboardFullyQualified = `${sap}${sapJavaInstanceDashboard}`;
export const sapDbTenantDashboardFullyQualified = `${sap}${sapDbTenantDashboard}`;
export const sapDbInstanceDashboardFullyQualified = `${sap}${sapDbInstanceDashboard}`;
export const abapCentralInstanceDashboardFullyQualified = `${sap}${abapCentralInstanceDashboard}`;
export const sapJavaCentralInstanceDashboardFullyQualified = `${sap}${sapJavaCentralInstanceDashboard}`;
export const summaryTab = '/summary';

export function useAbapSystemDashboard(
  hostId,
  matrixPrefix,
  systemSnapshotId,
  { tab, tabMatrix, timeConfig } = emptyObject
) {
  return useNavigateToDashboard({
    base: abapSystemDashboardFullyQualified,
    tab,
    tabMatrix,
    timeConfig,
    matrixSegment: abapSystemDashboard,
    matrixParam: matrixHostId,
    id: hostId,
    prefix: matrixPrefix,
    systemPrefix: systemPrefix,
    prefixSnapshot: systemSnapshotId,
    systemSnapShotPrefix: systemSnapShotPrefix
  });
}

export function useAbapInstanceDashboard(
  hostId,
  matrixPrefix,
  systemSnapshotId,
  { tab, tabMatrix, timeConfig } = emptyObject
) {
  return useNavigateToDashboard({
    base: abapInstanceDashboardFullyQualified,
    tab,
    tabMatrix,
    timeConfig,
    matrixSegment: abapInstanceDashboard,
    matrixParam: matrixHostId,
    id: hostId,
    prefix: matrixPrefix,
    systemPrefix: systemPrefix,
    prefixSnapshot: systemSnapshotId,
    systemSnapShotPrefix: systemSnapShotPrefix
  });
}

export function useAbapCentralInstanceDashboard(
  hostId,
  matrixPrefix,
  systemSnapshotId,
  { tab, tabMatrix, timeConfig } = emptyObject
) {
  return useNavigateToDashboard({
    base: abapCentralInstanceDashboardFullyQualified,
    tab,
    tabMatrix,
    timeConfig,
    matrixSegment: abapCentralInstanceDashboard,
    matrixParam: matrixHostId,
    id: hostId,
    prefix: matrixPrefix,
    systemPrefix: systemPrefix,
    prefixSnapshot: systemSnapshotId,
    systemSnapShotPrefix: systemSnapShotPrefix
  });
}

export function useSapJavaCentralInstanceDashboard(
  hostId,
  matrixPrefix,
  systemSnapshotId,
  { tab, tabMatrix, timeConfig } = emptyObject
) {
  return useNavigateToDashboard({
    base: sapJavaCentralInstanceDashboardFullyQualified,
    tab,
    tabMatrix,
    timeConfig,
    matrixSegment: sapJavaCentralInstanceDashboard,
    matrixParam: matrixHostId,
    id: hostId,
    prefix: matrixPrefix,
    systemPrefix: systemPrefix,
    prefixSnapshot: systemSnapshotId,
    systemSnapShotPrefix: systemSnapShotPrefix
  });
}

export function useSapDbmsDashboard(
  hostId,
  matrixPrefix,
  systemSnapshotId,
  { tab, tabMatrix, timeConfig } = emptyObject
) {
  return useNavigateToDashboard({
    base: sapDbmsDashboardFullyQualified,
    tab,
    tabMatrix,
    timeConfig,
    matrixSegment: sapDbmsDashboard,
    matrixParam: matrixHostId,
    id: hostId,
    prefix: matrixPrefix,
    systemPrefix: systemPrefix,
    prefixSnapshot: systemSnapshotId,
    systemSnapShotPrefix: systemSnapShotPrefix
  });
}

export function useSapHanaDashboard(
  hostId,
  matrixPrefix,
  systemSnapshotId,
  { tab, tabMatrix, timeConfig } = emptyObject
) {
  return useNavigateToDashboard({
    base: sapHanaDashboardFullyQualified,
    tab,
    tabMatrix,
    timeConfig,
    matrixSegment: sapHanaDashboard,
    matrixParam: matrixHostId,
    id: hostId,
    prefix: matrixPrefix,
    systemPrefix: systemPrefix,
    prefixSnapshot: systemSnapshotId,
    systemSnapShotPrefix: systemSnapShotPrefix
  });
}

export function useSapJavaSystemDashboard(
  hostId,
  matrixPrefix,
  systemSnapshotId,
  { tab, tabMatrix, timeConfig } = emptyObject
) {
  return useNavigateToDashboard({
    base: sapJavaSystemDashboardFullyQualified,
    tab,
    tabMatrix,
    timeConfig,
    matrixSegment: sapJavaSystemDashboard,
    matrixParam: matrixHostId,
    id: hostId,
    prefix: matrixPrefix,
    systemPrefix: systemPrefix,
    prefixSnapshot: systemSnapshotId,
    systemSnapShotPrefix: systemSnapShotPrefix
  });
}

export function useSapHanaSystemDashboard(
  hostId,
  matrixPrefix,
  systemSnapshotId,
  { tab, tabMatrix, timeConfig } = emptyObject
) {
  return useNavigateToDashboard({
    base: sapHanaSystemDashboardFullyQualified,
    tab,
    tabMatrix,
    timeConfig,
    matrixSegment: sapHanaSystemDashboard,
    matrixParam: matrixHostId,
    id: hostId,
    prefix: matrixPrefix,
    systemPrefix: systemPrefix,
    prefixSnapshot: systemSnapshotId,
    systemSnapShotPrefix: systemSnapShotPrefix
  });
}

export function useSapWebDispatcherDashboard(
  hostId,
  matrixPrefix,
  systemSnapshotId,
  { tab, tabMatrix, timeConfig } = emptyObject
) {
  return useNavigateToDashboard({
    base: sapWebDispatcherDashboardFullyQualified,
    tab,
    tabMatrix,
    timeConfig,
    matrixSegment: sapWebDispatcherDashboard,
    matrixParam: matrixHostId,
    id: hostId,
    prefix: matrixPrefix,
    systemPrefix: systemPrefix,
    prefixSnapshot: systemSnapshotId,
    systemSnapShotPrefix: systemSnapShotPrefix
  });
}

export function useSapJavaInstanceDashboard(
  hostId,
  matrixPrefix,
  systemSnapshotId,
  { tab, tabMatrix, timeConfig } = emptyObject
) {
  return useNavigateToDashboard({
    base: sapJavaInstanceDashboardFullyQualified,
    tab,
    tabMatrix,
    timeConfig,
    matrixSegment: sapJavaInstanceDashboard,
    matrixParam: matrixHostId,
    id: hostId,
    prefix: matrixPrefix,
    systemPrefix: systemPrefix,
    prefixSnapshot: systemSnapshotId,
    systemSnapShotPrefix: systemSnapShotPrefix
  });
}

export function useSapDbTenantDashboard(
  hostId,
  matrixPrefix,
  systemSnapshotId,
  { tab, tabMatrix, timeConfig } = emptyObject
) {
  return useNavigateToDashboard({
    base: sapDbTenantDashboardFullyQualified,
    tab,
    tabMatrix,
    timeConfig,
    matrixSegment: sapDbTenantDashboard,
    matrixParam: matrixHostId,
    id: hostId,
    prefix: matrixPrefix,
    systemPrefix: systemPrefix,
    prefixSnapshot: systemSnapshotId,
    systemSnapShotPrefix: systemSnapShotPrefix
  });
}

export function useSapDbInstanceDashboard(
  hostId,
  matrixPrefix,
  systemSnapshotId,
  { tab, tabMatrix, timeConfig } = emptyObject
) {
  return useNavigateToDashboard({
    base: sapDbInstanceDashboardFullyQualified,
    tab,
    tabMatrix,
    timeConfig,
    matrixSegment: sapDbInstanceDashboard,
    matrixParam: matrixHostId,
    id: hostId,
    prefix: matrixPrefix,
    systemPrefix: systemPrefix,
    prefixSnapshot: systemSnapshotId,
    systemSnapShotPrefix: systemSnapShotPrefix
  });
}

export function useSapAbapInstanceSensorDashboard(
  hostId,
  matrixPrefix,
  systemSnapshotId,
  { tab, tabMatrix, timeConfig } = emptyObject
) {
  return useNavigateToDashboard({
    base: sapAbapInstanceSensorDashboardFullyQualified,
    tab,
    tabMatrix,
    timeConfig,
    matrixSegment: sapAbapInstanceSensorDashboard,
    matrixParam: matrixHostId,
    id: hostId,
    prefix: matrixPrefix,
    systemPrefix: systemPrefix,
    prefixSnapshot: systemSnapshotId,
    systemSnapShotPrefix: systemSnapShotPrefix
  });
}

export function useSapAbapSystemSensorDashboard(
  hostId,
  matrixPrefix,
  systemSnapshotId,
  { tab, tabMatrix, timeConfig } = emptyObject
) {
  return useNavigateToDashboard({
    base: sapAbapSystemSensorDashboardFullyQualified,
    tab,
    tabMatrix,
    timeConfig,
    matrixSegment: sapAbapSystemSensorDashboard,
    matrixParam: matrixHostId,
    id: hostId,
    prefix: matrixPrefix,
    systemPrefix: systemPrefix,
    prefixSnapshot: systemSnapshotId,
    systemSnapShotPrefix: systemSnapShotPrefix
  });
}
export function useDashboardForEntity(snapshotId, plugin, label) {
  const abapCentralInstanceDashboard = useAbapCentralInstanceDashboard(snapshotId);
  const abapInstanceDashboard = useAbapInstanceDashboard(snapshotId);
  const abapSystemDashboard = useAbapSystemDashboard(snapshotId);
  const sapJavaSystemDashboard = useSapJavaSystemDashboard(snapshotId);
  const sapJavaInstanceDashboard = useSapJavaInstanceDashboard(snapshotId);
  const sapJavaCentralInstanceDashboard = useSapJavaCentralInstanceDashboard(snapshotId);
  const sapHanaSystemDashboard = useSapHanaSystemDashboard(snapshotId);
  const sapWebDispatcherDashboard = useSapWebDispatcherDashboard(snapshotId);
  const sapDbmsDashboard = useSapDbmsDashboard(snapshotId);
  const sapHanaDashboard = useSapHanaDashboard(snapshotId);
  const sapDbTenantDashboard = useSapDbTenantDashboard(snapshotId);
  const sapDbInstanceDashboard = useSapDbInstanceDashboard(snapshotId);
  const sapAbapInstanceSensorDashboard = useSapAbapInstanceSensorDashboard(snapshotId);
  const sapAbapSystemSensorDashboard = useSapAbapSystemSensorDashboard(snapshotId);

  switch (plugin) {
    case plugins.abapInstance:
      if (label && label.includes('Central')) return abapCentralInstanceDashboard;
      else return abapInstanceDashboard;
    case plugins.abapSystem:
      return abapSystemDashboard;
    case plugins.sapJavaSystem:
      return sapJavaSystemDashboard;
    case plugins.sapJavaInstance:
      if (label && label.includes('Central')) return sapJavaCentralInstanceDashboard;
      return sapJavaInstanceDashboard;
    case plugins.sapHanaSystem:
      return sapHanaSystemDashboard;
    case plugins.sapWebDispatcher:
      return sapWebDispatcherDashboard;
    case plugins.sapDbms:
      return sapDbmsDashboard;
    case plugins.sapHanaPlatform:
      return sapHanaDashboard;
    case plugins.sapDbTenant:
      return sapDbTenantDashboard;
    case plugins.sapDbInstance:
      return sapDbInstanceDashboard;
    case plugins.sapAbapInstanceSensor:
      return sapAbapInstanceSensorDashboard;
    case plugins.sapAbapSystemSensor:
      return sapAbapSystemSensorDashboard;
  }
}

function useNavigateToDashboard({
  base,
  tab = '/summary',
  tabMatrix = {},
  timeConfig,
  matrixSegment,
  matrixParam,
  id,
  prefix,
  systemPrefix,
  prefixSnapshot,
  systemSnapShotPrefix,
  paramsCallback
}) {
  const { location, createHref } = useNavigation();
  location.pathname = `${base}${tab}`;

  setOrDeleteMatrixKey(location, matrixSegment, matrixParam, id);
  setOrDeleteMatrixKey(location, matrixSegment, systemPrefix, prefix);
  setOrDeleteMatrixKey(location, matrixSegment, systemSnapShotPrefix, prefixSnapshot);

  if (timeConfig != null) {
    setTimeConfig(location, timeConfig);
  }

  location.matrix[tab] = tabMatrix;

  if (paramsCallback) {
    paramsCallback(location);
  }

  return createHref(location);
}

export const useNavigateToAbapSystemDashboard = () => {
  const { createHref, location } = useNavigation();

  return (id, prefix, prefixSnapshot, { tab = summaryTab, tabMatrix = {}, timeConfig } = emptyObject) => {
    location.pathname = abapSystemDashboardFullyQualified + tab;

    setOrDeleteMatrixKey(location, abapSystemDashboard, matrixHostId, id);
    setOrDeleteMatrixKey(location, abapSystemDashboard, systemPrefix, prefix);
    setOrDeleteMatrixKey(location, abapSystemDashboard, systemSnapShotPrefix, prefixSnapshot);

    if (timeConfig != null) {
      setTimeConfig(location, timeConfig);
    }

    location.matrix[tab] = tabMatrix;

    return createHref(location);
  };
};

export const useNavigateToTab = tab => {
  const { createHref, location } = useNavigation();

  return ({ tabMatrix = {}, timeConfig } = emptyObject) => {
    location.pathname = sapAbapInstanceSensorDashboardFullyQualified + tab;

    if (timeConfig) {
      setTimeConfig(location, timeConfig);
    }

    location.matrix[tab] = tabMatrix;
    return createHref(location);
  };
};
