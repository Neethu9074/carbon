/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Collapsible, DescriptionList, DescriptionItem } from '@instana/components';

import { t } from 'in-i18n';

export default function InterfaceList({ snapshot }) {
  const ifaces = snapshot.getIn(['data', 'interfaces']);
  if (!ifaces) {
    return null;
  }

  return (
    <div>
      <Collapsible initiallyOpen={false}>
        <Collapsible.Header>{t('in-forge:plugins.host.interfacesWithSize', { size: ifaces.size })}</Collapsible.Header>
        <Collapsible.Content>
          <DescriptionList>
            {ifaces
              .map((ifaceData, ifaceName) => (
                <DescriptionItem key={ifaceName} title={ifaceName}>
                  {formatIPs(ifaceData.get('addresses').map(address => address.get('ip')))}
                </DescriptionItem>
              ))
              .toArray()}
          </DescriptionList>
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}

function formatIPs(ips) {
  if (!ips) return null;
  // sort IPs based on their length, will make v4 come before v6
  const ipsSorted = ips.sort((a, b) => a.length - b.length);
  return (
    <span>
      {ipsSorted.map(ip => (
        <div key={ip}>{ip}</div>
      ))}
    </span>
  );
}
