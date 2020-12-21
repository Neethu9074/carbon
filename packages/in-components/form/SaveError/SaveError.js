import React from 'react';

import classNames from 'classnames';

import './SaveError.less';

const block = 'in-form-save-error';

export default function SaveError({ children, className }) {
  return <p className={classNames(block, className)}>{children}</p>;
}
