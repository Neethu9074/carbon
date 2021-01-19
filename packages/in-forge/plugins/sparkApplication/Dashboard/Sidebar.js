/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import KeyValueOverlay from 'in-sdk/components/sidebar/KeyValueOverlay';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';

import Info from '../Info';

export default function Sidebar({ snapshot }) {
  const conf = snapshot.getIn(['data', 'conf']);
  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>Spark Application</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>
      <KeyValueOverlay header="Spark Conf" data={conf} />

      <ServiceInstancesList snapshot={snapshot} />
    </div>
  );
}
