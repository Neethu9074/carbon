/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { useObservable } from '@instana/hooks';
import { TagCatalog } from '@instana/types';

import getBusinessMetricsTagsCatalog from 'in-bizops/subscriptions/getBusinessMetricsTagsCatalog';
import useTimeConfig from 'in-hooks/useTimeConfig';

interface UseBusinessMetricTagCatalogProps {
  metric?: string;
}

export default function useBusinessMetricsTagCatalog({
  metric
}: UseBusinessMetricTagCatalogProps): TagCatalog | undefined {
  const timeConfig = useTimeConfig();

  const tagCatalogResult = useObservable(
    () => getBusinessMetricsTagsCatalog({ metricName: metric, timeConfig }),
    [timeConfig, metric]
  );

  return tagCatalogResult?.data;
}
