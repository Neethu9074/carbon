import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';

import './Cell.less';

const block = 'in-lazy-table-cell';

export default function Cell({ children, col }) {
  return (
    <div className={block} style={{ maxWidth: col.width, minWidth: col.width }}>
      <div
        className={evaluateClassNames({
          [`${block}__content`]: true,
          [`${block}__content--nowrap`]: col.nowrap
        })}
      >
        {children}
      </div>
    </div>
  );
}
