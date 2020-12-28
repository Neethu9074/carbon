import classNames from 'classnames';
import React from 'react';

import { isBlank } from 'in-services/util/string';

import locals from './HorizontalDescriptionList.mless';

export function Dl({ children }) {
  return <dl className={locals.list}>{children}</dl>;
}

export function Di({ title, children, ddClassName, rowClassName, dtClassName, verticalDisplay }) {
  if (children == null || (typeof children === 'string' && isBlank(children))) {
    return null;
  }

  return (
    <div className={classNames(locals.item, rowClassName, verticalDisplay ? locals.verticalDisplay : '')}>
      <dt className={classNames(locals.title, dtClassName)}>{title}</dt>
      <dd className={classNames(locals.description, ddClassName)}>{children}</dd>
    </div>
  );
}
