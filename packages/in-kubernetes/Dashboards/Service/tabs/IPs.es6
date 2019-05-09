import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import Card from 'in-new-components/Card';

export default function IPs({ resource: service }) {
  return (
    <Card title="IPs">
      <Dl>
        <Di title="Cluster IP">{service.location || '-'}</Di>
        <Di title="External IP">{service.externalIP || '-'}</Di>
      </Dl>
    </Card>
  );
}
