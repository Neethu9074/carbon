import React from 'react';

import { joinClassNames } from 'in-services/util/classnames';

import locals from './QueryBuilderGroup.mless';

export default function QueryBuilderGroup({ renderTitle, children, className }) {
  return (
    <div className={joinClassNames(className, locals.group)}>
      <div className={locals.title}>{renderTitle()}</div>
      {children}
    </div>
  );
}
