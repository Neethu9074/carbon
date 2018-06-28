import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import BasicFilter from 'in-analyze/Filter/BasicFilter';

import locals from './Filter.mless';

export default function Filter(props) {
  const { title, children, size, className } = props;

  return (
    <BasicFilter
      {...props}
      className={evaluateClassNames({
        [locals.filter]: true,
        [locals[size]]: true,
        [className]: className
      })}
    >
      {title && (
        <div className={locals.rowWrapper}>
          <span className={locals.title}>{title}</span>
          <div className={locals.content}>{children}</div>
        </div>
      )}
      {!title && children}
    </BasicFilter>
  );
}
