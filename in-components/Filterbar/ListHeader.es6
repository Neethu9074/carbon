import React from 'react';

import {closeFilterbar} from 'in-components/Filterbar/stores/filterbarIsOpenStore';
import IconOnlyCloseButton from 'in-components/IconOnlyCloseButton';

import './ListHeader.less';


const block = 'in-sidebar-listheader';

export default function ListHeader({header}) {
  return (
    <div className={block}>
      <IconOnlyCloseButton onClick={closeFilterbar} />
      <h2 className={block + '__title'}>
        {header}
      </h2>
    </div>
  );
}
