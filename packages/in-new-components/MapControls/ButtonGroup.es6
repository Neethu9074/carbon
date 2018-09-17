import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';

import locals from './ButtonGroup.mless';

export default function ButtonGroup({ vertical, children }) {
  return (
    <div
      className={evaluateClassNames({
        [locals.group]: true,
        [locals.vertical]: vertical
      })}
    >
      {children}
    </div>
  );
}
