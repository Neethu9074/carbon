import React from 'react';

import Separator from 'in-sdk/components/sidebar/Separator';
import TagList from 'in-sdk/components/sidebar/TagList';

import Info from '../Info';

export default function EC2SidebarDetails({ snapshot }) {
  return (
    <div>
      <Separator />
      <Info snapshot={snapshot} />

      <TagList snapshot={snapshot} />
    </div>
  );
}
