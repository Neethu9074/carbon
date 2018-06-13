import React from 'react';

import { joinClassNames } from 'in-services/util/classnames';
import BasicFilter from 'in-analyze/Filter/BasicFilter';

import locals from './Filter.mless';

export default function Filter(props) {
  const { title, children, className } = props;

  return (
    <BasicFilter {...props} className={joinClassNames(className, locals.filter)}>
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
