/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Collapsible, DescriptionList, DescriptionItem } from '@instana/components';

import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import decamelize from 'in-sdk/decamelize';

export default function DefaultSidebar({ snapshot }) {
  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>{decamelize(snapshot.get('plugin'))}</Collapsible.Header>
        <Collapsible.Content>
          <DescriptionList>
            {snapshot
              .get('data')
              .entrySeq()
              .map(([key, value]) => (
                <DescriptionItem key={key} title={decamelize(key)}>
                  {value}
                </DescriptionItem>
              ))}
          </DescriptionList>
        </Collapsible.Content>
      </Collapsible>

      <ServiceInstancesList snapshot={snapshot} />
    </div>
  );
}
