import React from 'react';

import { joinClassNames } from 'in-services/util/classnames';

import locals from './FilterGroup.mless';

export default function FilterGroup({ name, children, className }) {
  return (
    <div className={joinClassNames(locals.filterGroup, className)}>
      {name && <span className={locals.name}>{name} </span>}
      {children}
    </div>
  );
}
