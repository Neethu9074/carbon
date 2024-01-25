/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { TagFilter } from '@instana/types';

import { buildJsonSerializer, setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { TAG } from 'in-components/QueryBuilder/transformation/formModel';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { cloneLocation } from 'in-stores/navigation/routing/clone';
import { logsPath } from 'in-logging/navigation/paths';
import { Location } from 'in-stores/navigation/types';

// TODO: Merge this with logging navigation hooks once that part of navigation has been refactored
export const useParamTagLinks = () => {
  const { createHref, location } = useNavigation();

  const getHrefWithAdditionalTagFilter = (name: string, key: string, value: string) => {
    const newLocation = cloneLocation(location as Location);
    newLocation.pathname = logsPath;
    setOrDeleteMatrixKey(newLocation, logsPath, 'dataSource', 'logs');
    setOrDeleteMatrixKey(newLocation, logsPath, 'detailId', null);
    setOrDeleteMatrixKey(newLocation, logsPath, 'groupBy', null);
    setOrDeleteMatrixKey(newLocation, logsPath, 'orderBy', null);
    setOrDeleteMatrixKey(newLocation, logsPath, 'metrics', null);
    setOrDeleteMatrixKey(
      newLocation,
      logsPath,
      'tagFilterExpression',
      buildJsonSerializer()([getTagExpressionWithTag(name ?? '', key ?? '', value)])
    );
    return createHref(newLocation);
  };

  const getHrefToGroupedView = (tagName: string, secondLevelKey: string) => {
    const newLocation = cloneLocation(location);
    newLocation.pathname = logsPath;
    setOrDeleteMatrixKey(newLocation, logsPath, 'dataSource', 'logs');
    setOrDeleteMatrixKey(newLocation, logsPath, 'detailId', null);
    setOrDeleteMatrixKey(newLocation, logsPath, 'orderBy', null);
    setOrDeleteMatrixKey(newLocation, logsPath, 'metrics', null);
    setOrDeleteMatrixKey(
      newLocation,
      logsPath,
      'groupBy',
      buildJsonSerializer()({ groupbyTag: tagName, groupbyTagSecondLevelKey: secondLevelKey })
    );
    return createHref(newLocation);
  };

  return { getHrefWithAdditionalTagFilter, getHrefToGroupedView };
};

function getTagExpressionWithTag(name: string, key?: string, value?: string): TagFilter {
  return {
    key,
    value,
    name,
    type: TAG,
    operator: EQUALS,
    entity: 'NOT_APPLICABLE'
  };
}
