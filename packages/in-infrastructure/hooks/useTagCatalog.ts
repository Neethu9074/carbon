/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { TagCatalog, TimeConfig } from '@instana/types';
import { useObservable } from '@instana/hooks';

import { useFilterContext } from 'in-custom-dashboards/CustomDashboard/FilterContext/FilterContext';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import getTagCatalog from 'in-infrastructure/Explore/services/getTagCatalog';
import useTimeConfig from 'in-hooks/useTimeConfig';

interface UseTagCatalogProps {
  metric?: string;
  ownerType?: string;
  includeMetricTags?: boolean;
  regex?: boolean;
}

export default function useTagCatalog({
  metric,
  ownerType,
  includeMetricTags = false,
  regex
}: UseTagCatalogProps): TagCatalog | undefined {
  const timeConfig = useTimeConfig();

  // Creating a copy of TimeConfig and setting the window size to 1 minute.
  const modifiedTimeConfig = {
    ...timeConfig,
    windowSize: 60000
  } as TimeConfig;

  const filterContext = useFilterContext();
  const tagFilterExpression = toBackendQueryModel(filterContext);
  const filter = { timeConfig: modifiedTimeConfig, tagFilterExpression };

  const tagCatalogResult = useObservable(
    () => getTagCatalog({ filter, metric, ownerType, regex: regex ?? false }),
    [timeConfig, metric, ownerType, regex, includeMetricTags]
  );

  return tagCatalogResult?.data;
}
