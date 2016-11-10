import React from 'react';

import Separator from 'in-sdk/components/sidebar/Separator';

import Info from '../Info';

export default function UnknownServiceSidebar() {
  return (
    <div>
      <Separator />
      <Info />
    </div>
  );
}
