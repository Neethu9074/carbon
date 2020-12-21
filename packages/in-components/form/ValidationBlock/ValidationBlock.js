import React from 'react';

import classNames from 'classnames';

import './ValidationBlock.less';

const block = 'in-form-validation-block';

export default function ValidationBlock({ children, className }) {
  return <p className={classNames(block, className)}>{children}</p>;
}
