import React from 'react';

import { joinClassNames } from 'in-services/util/classnames';

import './SaveError.less';

const block = 'in-form-save-error';

export default function SaveError({ children, className }) {
  return <p className={joinClassNames(block, className)}>{children}</p>;
}
