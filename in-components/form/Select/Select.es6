import React from 'react';

import {joinClassNames} from 'in-services/util/classnames';

import './Select.less';

const block = 'in-select';

export default function FormSelect(props) {
  return (
    <select {...props}
            className={joinClassNames(props.className, block)}/>
  );
}
