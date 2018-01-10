import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import locals from './ButtonGroup.mless';

export default function ButtonGroup({ children, className }) {
  const cssClass = evaluateClassNames({
    [locals.group]: true,
    [className]: !!className
  });

  return (
    <div className={cssClass} role="group">
      {children}
    </div>
  );
}
