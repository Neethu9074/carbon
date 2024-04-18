/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import Code from 'in-components/Code';

import locals from './ActionInstanceDetail.mless';

export default function DetailsOutputTab({ output }: { output: string }) {
  return (
    <div className={locals.instanceTabContent}>
      <Code code={output} lang={'bash'} softWrap />
    </div>
  );
}
