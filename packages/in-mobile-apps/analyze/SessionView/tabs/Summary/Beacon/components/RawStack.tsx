/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { removeBlankLines } from 'in-services/util/string';
import Code from 'in-components/Code';

import locals from './RawStack.mless';

export default function RawStack({ stack }: { stack: string }) {
  return (
    <Code
      wrapperClassName={locals.code}
      showLineNumbers={false}
      code={removeBlankLines(stack) || ''}
      // @ts-ignore Code does support Java, but the types are incomplete
      lang="java"
    />
  );
}
