/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Code as CodeSnippet } from '@instana/components';

export default function Code(props) {
  return (
    <CodeSnippet {...props} line={props.lang === 'java' ? getActualJavaLine(props.code, props.line) : props.line} />
  );
}

function getActualJavaLine(code, givenLine) {
  if (!givenLine) return null;

  const lineRegex = new RegExp('/\\*\\s*' + givenLine + '\\*/');
  const lines = code.split('\n');
  for (let i = 0, len = lines.length; i < len; i++) {
    const line = lines[i];
    if (lineRegex.test(line)) {
      return i + 1;
    }
  }
  return null;
}
