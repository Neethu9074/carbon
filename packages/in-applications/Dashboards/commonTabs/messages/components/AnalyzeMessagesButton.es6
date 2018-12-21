import React from 'react';

import { getLinkToAnalyze } from 'in-analyze/navigation/paths';
import Button from 'in-new-components/Button';

export default function AnalyzeMessagesButton({
  groupByTagName,
  applicationName,
  serviceName,
  endpointName,
  className
}) {
  const groupByTag = { name: groupByTagName };

  return (
    <Button
      className={className}
      kind="secondary"
      href$={getLinkToAnalyze({ applicationName, serviceName, endpointName, dataSource: 'calls', groupByTag })}
    >
      Analyze Messages
    </Button>
  );
}
