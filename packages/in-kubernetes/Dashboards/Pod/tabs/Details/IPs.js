/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import Card from 'in-new-components/Card';

export default function IPs({ resource: pod }) {
  return (
    <Card title="IPs">
      <Dl>
        <Di title="Host IP">{pod.hostIp || valueMissingPlaceholder}</Di>
        <Di title="Pod IP">{pod.podIp || valueMissingPlaceholder}</Di>
      </Dl>
    </Card>
  );
}
