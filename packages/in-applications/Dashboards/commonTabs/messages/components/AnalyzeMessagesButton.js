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
  query
}) {
  const groupByTag = { name: groupByTagName };
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
        filters:
          query.length > 0
            ? [{ name: 'log.message', value: query, operator: 'CONTAINS', entity: 'NOT_APPLICABLE' }]
            : null
      })}
    >
      Analyze Messages
    </Button>
  );
}
