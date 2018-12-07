import React from 'react';

import { sortKeys } from 'in-services/util/object';
import Code from 'in-components/Code';

import locals from './Meta.mless';

export default function Meta({ beacon }) {
  return (
    <Code
      wrapperClassName={locals.meta}
      showLineNumbers={false}
      code={JSON.stringify(sortKeys(beacon.meta), 0, 2)}
      lang="json"
    />
  );
}
