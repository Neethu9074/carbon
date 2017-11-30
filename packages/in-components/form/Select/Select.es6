import { assign } from 'lodash';
import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';

import './Select.less';

const block = 'in-select';

export default function FormSelect(props) {
  const selectProps = assign({}, props);
  selectProps.className = evaluateClassNames({
    [block]: true,
    [`${block}--has-error`]: props.hasError,
    [props.className]: props.className
  });
  delete selectProps.hasError;
  return <select {...selectProps} />;
}
