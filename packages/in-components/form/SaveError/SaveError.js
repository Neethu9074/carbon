/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import classNames from 'classnames';
import React from 'react';

import './SaveError.less';

const block = 'in-form-save-error';

export default function SaveError({ children, className }) {
  return <p className={classNames(block, className)}>{children}</p>;
}
