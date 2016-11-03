import React from 'react';

import {joinClassNames} from 'in-services/util/classnames';

import './Input.less';

const block = 'in-input';

export default function FormInput(props) {
  return (
    <input {...props}
           className={joinClassNames(props.className, block)}/>
  );
}
