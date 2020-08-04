import React from 'react';

import { Li } from 'in-new-components/lists/List';

import locals from './ListGroup.mless';

export default function ListGroup({ numMoreItems, label, children }) {
  return (
    <>
      <div className={locals.groupHead}>{label}</div>
      {children}
      {numMoreItems > 0 && (
        <Li className={locals.moreItems} noAlternatingBg>
          +{numMoreItems} more...
        </Li>
      )}
    </>
  );
}
