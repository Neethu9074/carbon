import React from 'react';

import Collapsible from 'in-sdk/components/sidebar/Collapsible';

export default function KubernetesPodSidebar() {
  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>Kubernetes Service</Collapsible.Header>
      </Collapsible>
    </div>
  );
}
