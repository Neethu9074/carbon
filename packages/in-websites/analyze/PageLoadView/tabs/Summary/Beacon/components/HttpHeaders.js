/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { expandNestedSerializedJson } from 'in-services/util/json';
import Code from 'in-components/Code';

import locals from './HttpHeaders.mless';

/*
add item to display http request/response headers.
 */
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
