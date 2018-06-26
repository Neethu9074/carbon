import React from 'react';

import { joinClassNames } from 'in-services/util/classnames';
import BasicFilter from 'in-analyze/Filter/BasicFilter';
import SvgIcon from 'in-components/SvgIcon';

import locals from './FilterPlaceholder.mless';

export default function FilterPlaceholder(props) {
  return (
    <BasicFilter {...props} className={joinClassNames(props.className, locals.filter)} isDeactivated>
      <SvgIcon className={locals.icon} type="lib_openclose_add" width={24} height={24} /> {props.children}
    </BasicFilter>
  );
}
