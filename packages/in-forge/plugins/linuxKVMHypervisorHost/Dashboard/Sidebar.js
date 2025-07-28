/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Collapsible, DescriptionList, DescriptionItem } from '@instana/components';

import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import decamelize from 'in-sdk/decamelize';

export default function LinuxKVMHypervisorHostSidebar({ snapshot }) {
  const storagePools = 'storagePools';
  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>{decamelize(snapshot.get('plugin'))}</Collapsible.Header>
        <Collapsible.Content>
          <DescriptionList>
            {snapshot
              .get('data')
              .entrySeq()
              .map(([key, value]) => {
                if (key !== storagePools) {
                  return (
                    <DescriptionItem key={key} title={decamelize(key)}>
                      {value}
                    </DescriptionItem>
                  );
                }
              })}
          </DescriptionList>
        </Collapsible.Content>
      </Collapsible>

      <ServiceInstancesList snapshot={snapshot} />
    </div>
  );
}
