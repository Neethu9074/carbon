import React from 'react';

import classNames from 'classnames';

import './MenuHeading.less';

const block = 'in-search-menu-heading';

export default function MenuHeading({ children, className }) {
  return <h1 className={classNames(className, block)}>{children}</h1>;
}
