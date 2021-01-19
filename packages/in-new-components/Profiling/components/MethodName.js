/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import locals from './MethodName.mless';

export default function MethodName({ methodName }) {
  return (
    <span className={locals.methodName}>
      {`<`}
      {methodName}
      {`>`}
    </span>
  );
}
