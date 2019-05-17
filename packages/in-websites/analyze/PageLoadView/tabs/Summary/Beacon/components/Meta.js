import React from 'react';

import { sortKeys } from 'in-services/util/object';
import Code from 'in-components/Code';

import locals from './Meta.mless';

export default function Meta({ beacon }) {
  return (
    <Code
      wrapperClassName={locals.meta}
      showLineNumbers={false}
      code={JSON.stringify(toConsumableJson(beacon.meta), 0, 2)}
      lang="json"
    />
  );
}

/**
 * The meta data transmission doesn't make any differentiation between value types.
 * This function will attempt to JSON parse the values for better presentation styles.
 */
export function toConsumableJson(obj) {
  obj = sortKeys(obj);

  Object.keys(obj).forEach(key => {
    try {
      obj[key] = JSON.parse(obj[key]);
    } catch (e) {
      // seems like it isn't JSON. Do not change the object
    }
  });

  return obj;
}
