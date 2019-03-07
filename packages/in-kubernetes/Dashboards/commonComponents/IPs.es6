import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import Card from 'in-new-components/Card';

export default function SpecList({ item }) {
  return (
    <Card title="IPs" useMaxAvailableHeight>
      <Dl>
        <Di title="Host IP">{item.hostIp || '-'}</Di>
        <Di title="Pod IP">{item.podIp || '-'}</Di>
      </Dl>
    </Card>
  );
}
