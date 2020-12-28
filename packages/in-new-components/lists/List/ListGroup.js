import classNames from 'classnames';
import React from 'react';

import { Li } from 'in-new-components/lists/List';

import locals from './ListGroup.mless';

export default function ListGroup({ numMoreItems, label, children, sticky = false, height = '2.5rem' }) {
  return (
    <>
      <div
        className={classNames({
          [locals.groupHead]: true,
          [locals.sticky]: sticky
        })}
        style={{ height: height }}
      >
        {label}
      </div>
      {children}
      {numMoreItems > 0 && (
        <Li className={locals.moreItems} noAlternatingBg>
          +{numMoreItems} more...
        </Li>
      )}
    </>
  );
}
