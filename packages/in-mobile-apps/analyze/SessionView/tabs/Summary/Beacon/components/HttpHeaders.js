/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */


import React from 'react';

import { expandNestedSerializedJson } from 'in-services/util/json';
import Code from 'in-components/Code';

import locals from './HttpHeaders.mless';

export default function HttpHeaders({ beacon }) {
  return (
    <Code
      wrapperClassName={locals.headers}
      showLineNumbers={false}
      code={JSON.stringify(expandNestedSerializedJson(beacon.httpCallHeaders), 0, 2)}
      lang="json"
    />
  );
}
