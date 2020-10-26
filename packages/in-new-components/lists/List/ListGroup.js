import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import { Li } from 'in-new-components/lists/List';

import locals from './ListGroup.mless';

export default function ListGroup({ numMoreItems, label, children, sticky = false, height = '2.5rem' }) {
  return (
    <>
      <div
        className={evaluateClassNames({
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
