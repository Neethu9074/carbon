import { assign } from 'lodash';
import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';

import locals from './Select.mless';

export default function FormSelect(props) {
  const selectProps = assign({}, props);
  selectProps.className = evaluateClassNames({
    [locals.select]: true,
    [`${locals.select}--has-error`]: props.hasError,
    [props.className]: props.className
  });
  delete selectProps.hasError;
  return (
    <div
      className={evaluateClassNames({
        [locals.selectWrapper]: true,
        [locals.selectWrapperDisabled]: props.disabled
      })}
    >
      <select {...selectProps} />
    </div>
  );
}
