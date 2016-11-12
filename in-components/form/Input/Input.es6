import {assign} from 'lodash';
import React from 'react';

import {evaluateClassNames} from 'in-services/util/classnames';

import './Input.less';

const block = 'in-input';

export default function FormInput(props) {
  const inputProps = assign({}, props);
  inputProps.className = evaluateClassNames({
    [block]: true,
    [`${block}--has-error`]: props.hasError,
    [props.className]: props.className
  });
  delete inputProps.hasError;

  return (
    <input {...inputProps} />
  );
}
