import React from 'react';

import './Tile.less';

const block = 'in-cockpit-tile';

export default function Tile({ header, children }) {
  return (
    <div className={block}>
      <div className={`${block}__header`}>
        {header}
      </div>
      <div className={`${block}__content`}>
        {children}
      </div>
    </div>
  );
}
