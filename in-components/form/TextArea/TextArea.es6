import React from 'react';

import {joinClassNames} from 'in-services/util/classnames';

import './TextArea.less';

const block = 'in-text-area';

export default function FormTextArea(props) {
  return (
    <textarea {...props}
              className={joinClassNames(props.className, block)} />
  );
}
