import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import Card from 'in-new-components/Card';

export default function IPs({ resource: pod }) {
  return (
    <Card title="IPs" useMaxAvailableHeight>
      <Dl>
        <Di title="Host IP">{pod.hostIp || '-'}</Di>
        <Di title="Pod IP">{pod.podIp || '-'}</Di>
      </Dl>
    </Card>
  );
}
