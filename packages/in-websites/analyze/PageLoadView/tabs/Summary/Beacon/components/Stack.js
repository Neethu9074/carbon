import React from 'react';

import Code from 'in-components/Code';

import locals from './Stack.mless';

export default function Stack({ stack }) {
  return <Code wrapperClassName={locals.code} showLineNumbers={false} code={stack} lang="plain" />;
}
