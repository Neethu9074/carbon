/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

export default function PhpCompileSpanDetailView() {
  return (
    <div>
      <p>This is a virtual span representing the total time spent on compiling files during the entire request.</p>
      <p>The duration shown is the sum of all compile actions regardless of when they happened in the request. </p>
    </div>
  );
}
