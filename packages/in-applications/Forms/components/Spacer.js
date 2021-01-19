/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import classNames from 'classnames';
import React from 'react';

import locals from './Spacer.mless';

export default function Spacer({ type, margin }) {
  return <div className={classNames(locals.spacer, locals[type], locals[margin])} />;
}
