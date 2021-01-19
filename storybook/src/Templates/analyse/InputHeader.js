/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

export default function InputHeader({ children }) {
  return (
    <div
      style={{
        padding: 16,
        marginBottom: 32,
        background: '#eee',
        borderBottom: '1px solid grey'
      }}
    >
      {children}
    </div>
  );
}
