import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import BasicFilter from 'in-analyze/Filter/BasicFilter';
import SvgIcon from 'in-components/SvgIcon';

import locals from './FilterPlaceholder.mless';

export default function FilterPlaceholder(props) {
  return (
    <BasicFilter
      {...props}
      className={evaluateClassNames({
        [locals.filter]: true,
        [locals[props.size]]: true,
        [props.className]: props.className
      })}
      isDeactivated
    >
      <SvgIcon className={locals.icon} type="lib_openclose_add" width={24} height={24} /> {props.children}
    </BasicFilter>
  );
}
