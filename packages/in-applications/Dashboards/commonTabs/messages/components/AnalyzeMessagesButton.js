import React from 'react';

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
  includeInternal
}) {
  const groupByTag = { name: groupByTagName };
  const filters = [];
  if (query.length > 0) {
    filters.push({ name: groupByTagName, value: query, operator: 'CONTAINS' });
  }
  if (includeInternal) {
    filters.push({ name: 'include_internal', value: 'true', operator: 'EQUALS' });
  }
  return (
    <Button
      className={className}
      kind="secondary"
      href$={getLinkToAnalyze({
        applicationName,
        serviceName,
        endpointName,
        dataSource: 'calls',
        groupByTag,
        boundaryScope,
        filters
      })}
    >
      Analyze Messages
    </Button>
  );
}
