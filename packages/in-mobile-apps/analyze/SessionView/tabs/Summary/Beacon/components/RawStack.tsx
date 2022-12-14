/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import {
  getStackFormatter,
  StackFormatterType
} from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/components/RawStackFormatter';
import Code from 'in-components/Code';

import locals from './RawStack.mless';

export type RawStackFormatterType = StackFormatterType;

interface RawStackProp {
  stack?: string;
  formatter: StackFormatterType;
}

export default function RawStack(props: RawStackProp) {
  const formatter = getStackFormatter(props.formatter);
  return (
    <Code
      wrapperClassName={locals.code}
      showLineNumbers={false}
      code={formatter.format(props.stack)}
      lang={formatter.lang}
    />
  );
}
