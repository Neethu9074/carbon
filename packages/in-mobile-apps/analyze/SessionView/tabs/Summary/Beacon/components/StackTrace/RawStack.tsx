/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import {
  StackTraceThreadDesc,
  StackTraceThreadFrameDesc,
  StackTraceThreadFrameType
} from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/components/StackTrace/BeaconStackParser';
import { removeBlankLines } from 'in-services/util/string';
import Code from 'in-components/Code';

import locals from './RawStack.mless';

export type RawStackFormat = 'raw' | 'stack-java' | 'stack-json';

export type RawStackData =
  | {
      format?: Extract<'raw' | 'stack-java', RawStackFormat>;
      stack?: string;
    }
  | {
      format: Extract<'stack-json', RawStackFormat>;
      stack?: StackTraceThreadDesc;
      analyzeFrame?: (frame: StackTraceThreadFrameDesc) => StackTraceThreadFrameType;
    };

export type RawStackProp = {
  data: RawStackData;
};

export default function RawStack(props: RawStackProp) {
  let stackTraceContent,
    stackTraceFormat = '';

  // IOS Stack Trace
  if (props.data?.format === 'stack-json') {
    const items = props.data.stack?.st ?? [];
    const analyzeFrameFunc = props.data.analyzeFrame;
    let userFrameFound = false;
    let renderedContent = ``;

    items.forEach(line => {
      const frameType = analyzeFrameFunc?.(line);
      let userFrameFoundSymbol = '  ';
      if (!userFrameFound && frameType == 'user') {
        userFrameFound = true;
        userFrameFoundSymbol = `→`;
      }
      const fileName = line.n ?? '<unknown>';
      const lineNum = line.o ?? '';
      const methodName = (line.t || line.f) ?? '<unknown>';
      let lineContent = `${userFrameFoundSymbol}${methodName} at ${fileName}:${lineNum}`;
      lineContent += `(${line.a})`;
      renderedContent += `${lineContent}\n`;
    });

    stackTraceContent = renderedContent;
    stackTraceFormat = props.data?.format === 'stack-json' ? 'java' : 'raw';
  }
  // Android Stack Trace
  else {
    stackTraceContent =
      (props.data?.format === 'stack-java' ? removeBlankLines(props.data?.stack) : props.data?.stack) ?? '';
    stackTraceFormat = props.data?.format === 'stack-java' ? 'java' : 'raw';
  }

  return (
    <Code
      wrapperClassName={locals.code}
      showLineNumbers={false}
      code={stackTraceContent}
      // @ts-expect-error Code does support Java, but the types are incomplete
      lang={stackTraceFormat}
    />
  );
}
