import React from 'react';

import 'in-views/cockpit/Tile.less';

const block = 'in-cockpit-tile';

export default function Cockpit({ header }) {
  return (
    <div className={block}>
      <div className={`${block}__header`}>
        {header}
      </div>
      <div className={`${block}__content`}>
        content
      </div>
    </div>
  );
}
