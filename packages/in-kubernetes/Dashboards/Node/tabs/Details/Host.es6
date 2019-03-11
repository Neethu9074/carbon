import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import Card from 'in-new-components/Card';

export default function Host({ resource: node }) {
  return (
    <Card title="Host" useMaxAvailableHeight>
      <Dl>
        <Di title="Machine ID">{node.machineId || '-'}</Di>
        <Di title="Boot ID">{node.bootId}</Di>
        <Di title="Hostname">{node.hostname || '-'}</Di>
      </Dl>
    </Card>
  );
}
