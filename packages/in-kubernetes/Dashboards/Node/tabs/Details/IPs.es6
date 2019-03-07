import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import Card from 'in-new-components/Card';

export default function IPs({ resource: node }) {
  return (
    <Card title="IPs" useMaxAvailableHeight>
      <Dl>
        <Di title="Internal IP">{node.internalIp || '-'}</Di>
        <Di title="Exnternal IP">{node.externalIp || '-'}</Di>
      </Dl>
    </Card>
  );
}
