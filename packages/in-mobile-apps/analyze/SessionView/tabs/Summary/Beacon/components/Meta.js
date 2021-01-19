/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { expandNestedSerializedJson } from 'in-services/util/json';
import Code from 'in-components/Code';

import locals from './Meta.mless';

export default function Meta({ beacon }) {
  return (
    <Code
      wrapperClassName={locals.meta}
      showLineNumbers={false}
      code={JSON.stringify(expandNestedSerializedJson(beacon.meta), 0, 2)}
      lang="json"
    />
  );
}
