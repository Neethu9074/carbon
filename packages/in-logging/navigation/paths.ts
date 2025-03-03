/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { buildJsonSerializer, setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { navigationParameters$ } from 'in-stores/navigation/navigation';
import { Grouping, TagFilterExpression, TimeConfig } from 'in-types';
import { getRootPathPredicate } from 'in-stores/navigation/paths';
import { setTimeConfig } from 'in-stores/time/config';
import { Location } from 'in-stores/navigation/types';

export const logsPath = '/logs';
//logs is already taken by Analytics > Logs
export const loggingDashboardPath = '/logging';
export const logsPathWithDataSource = '/logs;dataSource=logs';
export const alertsPath = '/alerts';
export const alertsDetailsPath = '/details';
export const alertsFullyQualifiedPath = `${logsPath}${alertsPath}`;
export const alertDetailsFullyQualifiedPath = `${alertsFullyQualifiedPath}${alertsDetailsPath}`;
export const dashboardAlertDetailsFullPath = `${loggingDashboardPath}${alertsPath}${alertsDetailsPath}`;
export const dashboardSmartAlertsPath = `${loggingDashboardPath}${alertsPath}`;
export const dashboardDeletePath = `${loggingDashboardPath}/delete`;
export const dashboardManagementPath = `${loggingDashboardPath}/manage`;
export const dashboardRetentionManagementPath = `${dashboardManagementPath}/retention`;
export const dashboardLogVolumePath = `${dashboardManagementPath}/logVolume`;
export const dashboardIntegrationsPath = `${dashboardManagementPath}/integrations`;
export const logSmartAlertsFullScreen = '/logSmartAlerts';
export const logSmartAlertsFullScreenFullyQualifiedPath = `${loggingDashboardPath}/logSmartAlerts`;

export const isLoggingView = getRootPathPredicate(loggingDashboardPath);

interface QueryBuilderTag {
  type: string;
  logicalOperator?: string;
}

interface GetLinkToLogsProps {
  tagFilterExpression: TagFilterExpression | FormModelElement[];
  timeConfig?: TimeConfig;
  groups?: Grouping[];
}

export function useGenerateLinkToLogs() {
  const { location, createHref } = useNavigation();

  return ({ tagFilterExpression, timeConfig }: GetLinkToLogsProps) =>
    getLogsHref(location, createHref, tagFilterExpression, timeConfig);
}

export function getLogsHref(
  location: Location,
  createHref: (target: Location) => string,
  tagFilterExpression?: QueryBuilderTag | TagFilterExpression | Array<QueryBuilderTag | TagFilterExpression>,
  timeConfig?: TimeConfig,
  grouping?: Grouping[]
) {
  location.pathname = logsPath;

  setOrDeleteMatrixKey(location, logsPath, 'dataSource', 'logs');
  setOrDeleteMatrixKey(location, logsPath, 'detailId', null);
  setOrDeleteMatrixKey(location, logsPath, 'groupBy', null);
  setOrDeleteMatrixKey(location, logsPath, 'orderBy', null);
  setOrDeleteMatrixKey(location, logsPath, 'metrics', null);

  if (tagFilterExpression && !Array.isArray(tagFilterExpression)) {
    tagFilterExpression = [tagFilterExpression];
  }
  const groupBy =
    grouping?.[0]?.by && grouping[0].by.groupbyTag
      ? grouping[0].by.groupbyTagEntity === 'NOT_APPLICABLE'
        ? { groupbyTag: grouping[0].by.groupbyTag }
        : {
            groupbyTag: grouping[0].by.groupbyTag,
            groupbyTagEntity: grouping[0].by.groupbyTagEntity
          }
      : null;

  setOrDeleteMatrixKey(
    location,
    logsPath,
    'tagFilterExpression',
    tagFilterExpression ? buildJsonSerializer()(tagFilterExpression) : tagFilterExpression
  );

  setOrDeleteMatrixKey(location, logsPath, 'groupBy', groupBy ? buildJsonSerializer()(groupBy) : null);

  if (timeConfig) {
    setTimeConfig(location, timeConfig);
  }

  return createHref(location);
}

export function useLinkToLogs({ tagFilterExpression, timeConfig, groups }: GetLinkToLogsProps) {
  const { location, createHref } = useNavigation();

  return getLogsHref(location, createHref, tagFilterExpression, timeConfig, groups);
}

export const isAnalyzeView = navigationParameters$.map(location => location.pathname.indexOf(logsPath) === 0);
