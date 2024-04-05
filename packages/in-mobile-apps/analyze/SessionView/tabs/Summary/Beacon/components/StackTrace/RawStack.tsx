/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { startsWith } from 'lodash';
import React from 'react';

import { SvgIcon } from '@instana/components';

import {
  StackTraceThreadDesc,
  StackTraceThreadFrameDesc,
  StackTraceThreadFrameType
} from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/components/StackTrace/BeaconStackParser';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
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
  if (props.data?.format === 'stack-json') {
    const items = props.data.stack?.st ?? [];
    const analyzeFrameFunc = props.data.analyzeFrame;
    let userFrameFound = false;
    return (
      <div>
        {items.map((line, i) => {
          const frameType = analyzeFrameFunc?.(line);
          let icon = <div className={locals.iconPlaceholder} />;
          if (!userFrameFound && frameType == 'user') {
            userFrameFound = true;
            icon = <SvgIcon className={locals.icon} type="lib_arrow_short_right" size="xs" />;
          }

          return (
            <div key={i} className={locals.line}>
              <HorizontalFlexWrapper className={locals.signature}>
                {icon}
                <MethodName frameType={frameType} methodName={line.t || line.f} />
                <At />
                <FileNameAndLine file={line.n} line={line.o} />
              </HorizontalFlexWrapper>
              <span className={locals.rightmost}>{line.a}</span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <Code
      wrapperClassName={locals.code}
      showLineNumbers={false}
      code={(props.data?.format === 'stack-java' ? removeBlankLines(props.data?.stack) : props.data?.stack) ?? ''}
      // @ts-expect-error Code does support Java, but the types are incomplete
      lang={props.data?.format === 'stack-java' ? 'java' : 'raw'}
    />
  );
}

function MethodName(props: { methodName?: string; frameType?: StackTraceThreadFrameType }) {
  const name = props.methodName ?? '<unknown>';
  let className: string;

  if (props.frameType === 'user') {
    className = locals.methodNameHighlight;
  } else if (startsWith(name, '<')) {
    className = locals.methodNameInvalid;
  } else {
    className = locals.methodName;
  }
  return <span className={className}>{name}</span>;
}

function FileNameAndLine(props: { file?: string; line?: string }) {
  return (
    <span className={locals.fileName}>
      {props.file ?? '<unknown>'}
      {props.line ? `:${props.line}` : ''}
    </span>
  );
}

function At() {
  return <span className={locals.at}>at</span>;
}
