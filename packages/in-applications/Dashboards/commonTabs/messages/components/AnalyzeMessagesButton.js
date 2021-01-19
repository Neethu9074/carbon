/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { getTagCatalog } from 'in-applications/analyze/components/workspace/CallQueryBuilder';
import useTagCatalog from 'in-applications/hooks/useTagCatalog';
import { getLinkToAnalyze } from 'in-analyze/navigation/paths';
import Button from 'in-new-components/Button';

export default function AnalyzeMessagesButton({
  groupByTagName,
  applicationName,
  serviceName,
  endpointName,
  className,
  boundaryScope,
  query,
  includeInternal,
  includeSynthetic,
  showErroneous
}) {
  const tagCatalog = useTagCatalog(getTagCatalog);
  const groupByTag = { name: groupByTagName };
  const filters = [];
  if (query.length > 0) {
    filters.push({ name: groupByTagName, value: query, operator: 'CONTAINS' });
  }
  if (includeInternal) {
    filters.push({ name: 'include_internal', value: 'true', operator: 'EQUALS' });
  }
  if (includeSynthetic) {
    filters.push({ name: 'include_synthetic', value: 'true', operator: 'EQUALS' });
  }
  if (showErroneous) {
    filters.push({ name: 'call.erroneous', value: 'true', operator: 'EQUALS' });
  }
  const orderBy = showErroneous ? 'erroneousCalls_SUM_Agg' : null;
  const focusedMetric = showErroneous ? 'erroneousCalls_SUM' : null;
  const metrics = showErroneous
    ? [
        {
          metric: 'erroneousCalls',
          aggregation: 'SUM'
        }
      ]
    : null;
  return (
    <Button
      className={className}
      kind="secondary"
      href$={
        tagCatalog &&
        getLinkToAnalyze({
          applicationName,
          serviceName,
          endpointName,
          dataSource: 'calls',
          groupByTag,
          boundaryScope,
          filters,
          tagCatalog,
          orderBy,
          focusedMetric,
          metrics
        })
      }
    >
      Analyze Messages
    </Button>
  );
}
