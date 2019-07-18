import React from 'react';

import { removeBlankLines } from 'in-services/util/string';
import Code from 'in-components/Code';

import locals from './Stack.mless';

export default function Stack({ stack }) {
  return <Code wrapperClassName={locals.code} showLineNumbers={false} code={removeBlankLines(stack)} lang="plain" />;
}
