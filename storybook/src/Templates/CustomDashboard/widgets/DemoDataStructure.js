/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import Code from 'in-components/Code';

export default function DemoDataStructure({ config }) {
  return <Code code={JSON.stringify(config, 0, 2)} lang="json" showLineNumbers={false} />;
}
