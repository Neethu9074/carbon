/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import classNames from 'classnames';
import React from 'react';

import './ValidationBlock.less';

const block = 'in-form-validation-block';

export default function ValidationBlock({ children, className }) {
  return <p className={classNames(block, className)}>{children}</p>;
}
