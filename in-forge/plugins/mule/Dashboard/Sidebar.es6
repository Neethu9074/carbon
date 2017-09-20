import React from 'react';

import Info from 'in-forge/plugins/mule/Info';
import Separator from 'in-sdk/components/sidebar/Separator';

export default function MuleSidebar({ snapshot }) {
  return (
    <div>
      <Separator />
      <Info snapshot={snapshot} />
    </div>
  );
}
