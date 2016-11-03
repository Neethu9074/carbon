import React from 'react';

import './NavItems.less';

const block = 'in-config-view-nav-items';

export default function NavItems({children}) {
  return (
    <ul className={block}>
      {children}
    </ul>
  );
}
