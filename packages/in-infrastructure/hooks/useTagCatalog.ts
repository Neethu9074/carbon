/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { useObservable } from '@instana/hooks';
import { TagCatalog } from '@instana/types';

import { EMPTY_EXPRESSION } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import getTagCatalogSubscription from 'in-infrastructure/subscriptions/getTagCatalog';
import { getTagCatalogOnce } from 'in-services/tags/tagCatalog';
import useTimeConfig from 'in-hooks/useTimeConfig';

const getTagCatalog = getTagCatalogOnce(getTagCatalogSubscription, true);

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

  const filter = { timeConfig, tagFilterExpression: EMPTY_EXPRESSION };

  const tagCatalogResult = useObservable(() => getTagCatalog({ filter, metric, ownerType }), [
    timeConfig,
    metric,
    ownerType,
    includeMetricTags
  ]);

  return tagCatalogResult?.data;
}
