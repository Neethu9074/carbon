/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { buildJsonSerializer, setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { navigationParameters$ } from 'in-stores/navigation/navigation';
import { TagFilterExpression, TimeConfig } from 'in-types';
import { setTimeConfig } from 'in-stores/time/config';
import { Location } from 'in-stores/navigation/types';

export const logsPath = '/logs';
export const alertsPath = '/alerts';
export const alertsDetailsPath = '/details';
export const alertsFullyQualifiedPath = `${logsPath}${alertsPath}`;
export const alertDetailsFullyQualifiedPath = `${alertsFullyQualifiedPath}${alertsDetailsPath}`;

interface QueryBuilderTag {
  type: string;
  logicalOperator?: string;
}

interface GetLinkToLogsProps {
  tagFilterExpression: TagFilterExpression | FormModelElement[];
  timeConfig?: TimeConfig;
}

export function useGenerateLinkToLogs() {
  const { location, createHref } = useNavigation();

  return ({ tagFilterExpression, timeConfig }: GetLinkToLogsProps) =>
    getLogsHref(location, createHref, tagFilterExpression, timeConfig);
}

function getLogsHref(
  location: Location,
  createHref: (target: Location) => string,
  tagFilterExpression?: QueryBuilderTag | TagFilterExpression | Array<QueryBuilderTag | TagFilterExpression>,
  timeConfig?: TimeConfig
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

  setOrDeleteMatrixKey(
    location,
    logsPath,
    'tagFilterExpression',
    tagFilterExpression ? buildJsonSerializer()(tagFilterExpression) : tagFilterExpression
  );

  if (timeConfig) {
    setTimeConfig(location, timeConfig);
  }

  return createHref(location);
}

export function useLinkToLogs({ tagFilterExpression, timeConfig }: GetLinkToLogsProps) {
  const { location, createHref } = useNavigation();

  return getLogsHref(location, createHref, tagFilterExpression, timeConfig);
}

export const isAnalyzeView = navigationParameters$.map(location => location.pathname.indexOf(logsPath) === 0);
