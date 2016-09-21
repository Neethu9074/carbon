import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';


export default function InterfaceList({snapshot}) {
  const ifaces = snapshot.getIn(['data', 'interfaces']);
  if (!ifaces) {
    return null;
  }

  return (
    <div>
      <Separator />

      <Collapsible initiallyOpen={false}>
        <Collapsible.Header>Interfaces ({ifaces.size})</Collapsible.Header>
        <Collapsible.Content>
          <DescriptionList>
            {ifaces.map((ifaceData, ifaceName) =>
              <DescriptionItem key={ifaceName} title={ifaceName}>
                {formatIPs(ifaceData.get('addresses').map(address => address.get('ip')))}
              </DescriptionItem>
            ).toArray()}
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
      {ipsSorted.map((ip) =>
        <div key={ip}>
          {ip}
        </div>
      )}
    </span>
  );
}
