/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

export default function NoWrap({ children }) {
  return (
    <span
      style={{
        whiteSpace: 'nowrap'
      }}
    >
      {children}
    </span>
  );
}
