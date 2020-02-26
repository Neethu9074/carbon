import React from 'react';

import Collapsible from 'in-sdk/components/sidebar/Collapsible';

export default function KubernetesPodSidebar() {
  return (
    <Collapsible>
      <Collapsible.Header>Kubernetes Service</Collapsible.Header>
      <Collapsible.Content />
    </Collapsible>
  );
}
