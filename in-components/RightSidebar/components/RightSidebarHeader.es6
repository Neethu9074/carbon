import React from 'react';

import IconOnlyCloseButton from 'in-components/IconOnlyCloseButton';

import './RightSidebarHeader.less';


const block = 'in-right-sidebar-header';

export default function RightSidebarHeader({title, onClose, children}) {
  if (!title) {
    return null;
  }
  return (
    <div className={block}>
      <div className={block + '__left'}>
        <IconOnlyCloseButton onClick={onClose} />
        <h2 className={block + '__title'}>
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}
