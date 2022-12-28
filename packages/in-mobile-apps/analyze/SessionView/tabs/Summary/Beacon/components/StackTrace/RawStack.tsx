/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { removeBlankLines } from 'in-services/util/string';
import Code from 'in-components/Code';

import locals from './RawStack.mless';

interface RawStackProp {
  raw?: boolean;
  stack?: string;
}

export default function RawStack(props: RawStackProp) {
  return (
    <Code
      wrapperClassName={locals.code}
      showLineNumbers={false}
      code={(props.raw ? props.stack : removeBlankLines(props.stack)) ?? ''}
      // @ts-ignore Code does support Java, but the types are incomplete
      lang={props.raw ? 'git' : 'java'}
    />
  );
}
