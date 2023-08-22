/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { TagCatalog, TimeConfig } from '@instana/types';
import { useObservable } from '@instana/hooks';

import { EMPTY_EXPRESSION } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import getTagCatalogSubscription from 'in-infrastructure/subscriptions/getTagCatalog';
import { tagCatalogSmallQueryWindowEnabled } from 'in-services/featureFlags';
import { getTagCatalogOnce } from 'in-services/tags/tagCatalog';
import useTimeConfig from 'in-hooks/useTimeConfig';

const getTagCatalog = getTagCatalogOnce(getTagCatalogSubscription, true, 'infrastructure');

interface UseTagCatalogProps {
  metric?: string;
  ownerType?: string;
  includeMetricTags?: boolean;
}

export default function useTagCatalog({
  metric,
  ownerType,
  includeMetricTags = false
}: UseTagCatalogProps): TagCatalog | undefined {
  const timeConfig = useTimeConfig();

  // Creating a copy of TimeConfig and setting the window size to 1 minute.
  const modifiedTimeConfig = {
    ...timeConfig,
    windowSize: 60000
  } as TimeConfig;

  const config = tagCatalogSmallQueryWindowEnabled ? modifiedTimeConfig : timeConfig;

  const filter = { timeConfig: config, tagFilterExpression: EMPTY_EXPRESSION };

  const tagCatalogResult = useObservable(
    () => getTagCatalog({ filter, metric, ownerType }),
    [timeConfig, metric, ownerType, includeMetricTags]
  );

  return tagCatalogResult?.data;
}
