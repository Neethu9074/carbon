/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import Card from 'in-new-components/Card';

export default function IPs({ resource: node }) {
  return (
    <Card title="IPs">
      <Dl>
        <Di title="Internal IP">{node.internalIp || valueMissingPlaceholder}</Di>
        <Di title="Exnternal IP">{node.externalIp || valueMissingPlaceholder}</Di>
      </Dl>
    </Card>
  );
}
