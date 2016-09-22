import React from 'react';

import {clearActiveControl} from 'in-components/RightSidebar/stores/rightSidebarActiveControlStore';
import IconOnlyCloseButton from 'in-components/RightSidebar/components/IconOnlyCloseButton';

import './RightSidebarHeader.less';


const block = 'in-right-sidebar-header';

export default function RightSidebarHeader({title, children}) {
  if (!title) {
    return null;
  }
  return (
    <div className={block}>
      <div className={block + '__left'}>
        <IconOnlyCloseButton onClick={clearActiveControl} />
        <h2 className={block + '__title'}>
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}
