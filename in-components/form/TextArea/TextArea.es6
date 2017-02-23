import {assign} from 'lodash';
import React from 'react';

import {evaluateClassNames} from 'in-services/util/classnames';

import './TextArea.less';

const block = 'in-text-area';

export default function FormTextArea(props) {
  const textAreaProps = assign({}, props);
  textAreaProps.className = evaluateClassNames({
    [block]: true,
    [`${block}--has-error`]: props.hasError,
    [props.className]: props.className
  });
  delete textAreaProps.hasError;

  return (
    <textarea {...textAreaProps} />
  );
}
