import React from 'react';

import {joinClassNames} from 'in-services/util/classnames';

import './MenuHeading.less';

const block = 'in-search-menu-heading';

export default function MenuHeading({children, className}) {
  return (
    <h1 className={joinClassNames(className, block)}>
      {children}
    </h1>
  );
}
