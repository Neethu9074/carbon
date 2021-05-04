/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import locals from './Group.mless';

export default function Group({ title, children }) {
  return (
    <div className={locals.group}>
      <span className={locals.title}>{title}</span>
      <div className={locals.content}>{children}</div>
    </div>
  );
}
