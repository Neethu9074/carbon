/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { removeBlankLines } from 'in-services/util/string';
import Code from 'in-components/Code';

import locals from './RawStack.mless';

export default function RawStack({ stack }) {
  return <Code wrapperClassName={locals.code} showLineNumbers={false} code={removeBlankLines(stack)} lang="plain" />;
}
