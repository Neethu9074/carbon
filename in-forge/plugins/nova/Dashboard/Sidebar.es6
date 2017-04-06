import React from 'react';

import Separator from 'in-sdk/components/sidebar/Separator';

import Info from '../Info';

export default function NovaSidebarDetails({ snapshot }) {
  return (
    <div>
      <Separator />
      <Info snapshot={snapshot} />
    </div>
  );
}
