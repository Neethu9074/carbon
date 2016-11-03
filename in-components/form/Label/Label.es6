import React from 'react';

import {joinClassNames} from 'in-services/util/classnames';

import './Label.less';

const block = 'in-label';

export default function FormLabel(props) {
  return (
    <label {...props}
           className={joinClassNames(props.className, block)} />
  );
}
