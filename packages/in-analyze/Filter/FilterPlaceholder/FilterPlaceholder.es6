import React from 'react';

import { joinClassNames } from 'in-services/util/classnames';
import BasicFilter from 'in-analyze/Filter/BasicFilter';

import locals from './FilterPlaceholder.mless';

export default function FilterPlaceholder(props) {
  return <BasicFilter {...props} className={joinClassNames(props.className, locals.filter)} isDeactivated />;
}
