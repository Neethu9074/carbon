/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import Card from 'in-new-components/Card';

export default function IPs({ resource: service }) {
  return (
    <Card title="IPs">
      <Dl>
        <Di title="Cluster IP">{service.location || valueMissingPlaceholder}</Di>
        <Di title="External IP">{service.externalIP || valueMissingPlaceholder}</Di>
      </Dl>
    </Card>
  );
}
