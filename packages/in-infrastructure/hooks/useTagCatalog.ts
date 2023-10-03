/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { TagCatalog, TimeConfig } from '@instana/types';
import { useObservable } from '@instana/hooks';

import { EMPTY_EXPRESSION } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import getTagCatalogSubscription from 'in-infrastructure/subscriptions/getTagCatalog';
import { getTagCatalogOnce } from 'in-services/tags/tagCatalog';
import useTimeConfig from 'in-hooks/useTimeConfig';

const getTagCatalog = getTagCatalogOnce(getTagCatalogSubscription, true, 'infrastructure');

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

  const filter = { timeConfig: modifiedTimeConfig, tagFilterExpression: EMPTY_EXPRESSION };

  const tagCatalogResult = useObservable(
    () => getTagCatalog({ filter, metric, ownerType, regex: regex ?? false }),
    [timeConfig, metric, ownerType, regex, includeMetricTags]
  );

  return tagCatalogResult?.data;
}
