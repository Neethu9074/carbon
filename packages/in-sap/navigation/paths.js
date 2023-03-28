/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { hostId as matrixHostId, systemSnapShotPrefix } from 'in-sap/navigation/matrix';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
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
export const sapJavaInstanceDashboard = `/sapjavainstance`;
export const sapDbInstanceDashboard = `/sapdbinstance`;
export const sapDbTenantDashboard = `/sapdbtenant`;
export const sapHostDashboardFullyQualified = `${sap}${sapHostList}`;
export const abapInstanceDashboardFullyQualified = `${sap}${abapInstanceDashboard}`;
export const abapSystemDashboardFullyQualified = `${sap}${abapSystemDashboard}`;
export const sapDbmsDashboardFullyQualified = `${sap}${sapDbmsDashboard}`;
export const sapHanaDashboardFullyQualified = `${sap}${sapHanaDashboard}`;
export const sapJavaSystemDashboardFullyQualified = `${sap}${sapJavaSystemDashboard}`;
export const sapJavaInstanceDashboardFullyQualified = `${sap}${sapJavaInstanceDashboard}`;
export const sapDbTenantDashboardFullyQualified = `${sap}${sapDbTenantDashboard}`;
export const sapDbInstanceDashboardFullyQualified = `${sap}${sapDbInstanceDashboard}`;
export const abapCentralInstanceDashboardFullyQualified = `${sap}${abapCentralInstanceDashboard}`;

export function getAbapSystemDashboard(
  hostId,
  matrixPrefix,
  systemSnapshotId,
  { tab, tabMatrix, timeConfig } = emptyObject
) {
  return getDashboard({
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

export function getAbapInstanceDashboard(
  hostId,
  matrixPrefix,
  systemSnapshotId,
  { tab, tabMatrix, timeConfig } = emptyObject
) {
  return getDashboard({
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

export function getAbapCentralInstanceDashboard(
  hostId,
  matrixPrefix,
  systemSnapshotId,
  { tab, tabMatrix, timeConfig } = emptyObject
) {
  return getDashboard({
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

export function getSapDbmsDashboard(
  hostId,
  matrixPrefix,
  systemSnapshotId,
  { tab, tabMatrix, timeConfig } = emptyObject
) {
  return getDashboard({
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

export function getSapHanaDashboard(
  hostId,
  matrixPrefix,
  systemSnapshotId,
  { tab, tabMatrix, timeConfig } = emptyObject
) {
  return getDashboard({
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

export function getSapJavaSystemDashboard(
  hostId,
  matrixPrefix,
  systemSnapshotId,
  { tab, tabMatrix, timeConfig } = emptyObject
) {
  return getDashboard({
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

export function getSapJavaInstanceDashboard(
  hostId,
  matrixPrefix,
  systemSnapshotId,
  { tab, tabMatrix, timeConfig } = emptyObject
) {
  return getDashboard({
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

export function getSapDbTenantDashboard(
  hostId,
  matrixPrefix,
  systemSnapshotId,
  { tab, tabMatrix, timeConfig } = emptyObject
) {
  return getDashboard({
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

export function getSapDbInstanceDashboard(
  hostId,
  matrixPrefix,
  systemSnapshotId,
  { tab, tabMatrix, timeConfig } = emptyObject
) {
  return getDashboard({
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

export function getDashboardForEntity(snapshotId, plugin, label) {
  switch (plugin) {
    case plugins.abapInstance:
      if (label && label.includes('Central')) return getAbapCentralInstanceDashboard(snapshotId);
      else return getAbapInstanceDashboard(snapshotId);
    case plugins.abapSystem:
      return getAbapSystemDashboard(snapshotId);
    case plugins.sapJavaSystem:
      return getSapJavaSystemDashboard(snapshotId);
    case plugins.sapJavaInstance:
      return getSapJavaInstanceDashboard(snapshotId);
    case plugins.sapDbms:
      return getSapDbmsDashboard(snapshotId);
    case plugins.sapHanaPlatform:
      return getSapHanaDashboard(snapshotId);
    case plugins.sapDbTenant:
      return getSapDbTenantDashboard(snapshotId);
    case plugins.sapDbInstance:
      return getSapDbInstanceDashboard(snapshotId);
  }
}

function getDashboard({
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
  return getModifiedUrlStream(params => {
    params.pathname = `${base}${tab}`;

    setOrDeleteMatrixKey(params, matrixSegment, matrixParam, id);
    setOrDeleteMatrixKey(params, matrixSegment, systemPrefix, prefix);
    setOrDeleteMatrixKey(params, matrixSegment, systemSnapShotPrefix, prefixSnapshot);

    if (timeConfig != null) {
      setTimeConfig(params, timeConfig);
    }

    params.matrix[tab] = tabMatrix;

    if (paramsCallback) {
      paramsCallback(params);
    }
  });
}
