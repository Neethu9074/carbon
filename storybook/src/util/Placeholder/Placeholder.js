/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import locals from './Placeholder.mless';

export default function Placeholder({ style, height }) {
  return (
    <div
      style={{
        ...style,
        height: `${height}px`
      }}
      className={locals.placeholder}
    />
  );
}
