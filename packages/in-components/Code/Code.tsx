/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Code as CodeSnippet, CodeProps } from '@instana/components';

export default function Code(props: CodeProps) {
  return (
    <CodeSnippet
      {...props}
      line={
        // @ts-ignore Code does support Java, but the types are incomplete
        props.lang === 'java' ? getActualJavaLine(props.code, props.line) : props.line
      }
    />
  );
}

function getActualJavaLine(code: string, givenLine?: number) {
  if (!givenLine) return undefined;

  const lineRegex = new RegExp('/\\*\\s*' + givenLine + '\\*/');
  const lines = code.split('\n');
  for (let i = 0, len = lines.length; i < len; i++) {
    const line = lines[i];
    if (lineRegex.test(line)) {
      return i + 1;
    }
  }
  return undefined;
}
