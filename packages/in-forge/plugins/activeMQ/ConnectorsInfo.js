/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { emptyMap } from 'in-services/fixedImmutables';

export default function ConnectorsInfo({ snapshot }) {
  const data = snapshot.get('data');
  const transportConnectors = data.get('transportConnectors', emptyMap);
  return (
    <DescriptionList>
      {transportConnectors
        .map((connectorURI, connectorName) => (
          <DescriptionItem key={connectorName} title={connectorName}>
            {connectorURI}
          </DescriptionItem>
        ))
        .valueSeq()
        .toArray()}
    </DescriptionList>
  );
}
