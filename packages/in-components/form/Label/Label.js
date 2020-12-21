import { assign } from 'lodash';
import React from 'react';

import classNames from 'classnames';

import './Label.less';

const block = 'in-label';

export default function FormLabel(props) {
  const labelProps = assign({}, props);
  labelProps.className = classNames({
    [block]: true,
    [`${block}--has-error`]: props.hasError,
    [props.className]: props.className
  });
  delete labelProps.hasError;

  return <label {...labelProps} />;
}
