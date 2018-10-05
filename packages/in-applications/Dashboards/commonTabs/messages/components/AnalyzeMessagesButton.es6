import React from 'react';

import { getLinkToAnalyze } from 'in-analyze/navigation/paths';
import Button from 'in-new-components/Button';

export default function AnalyzeMessagesButton({
  groupByTagName,
  applicationName,
  serviceName,
  endpointId: endpointName
}) {
  const groupByTag = { name: groupByTagName };

  return (
    <Button
      kind="secondary"
      size="compact"
      href$={getLinkToAnalyze({ applicationName, serviceName, endpointName, dataSource: 'calls', groupByTag })}
    >
      Analyze Messages
    </Button>
  );
}
