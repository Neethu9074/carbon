/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React from 'react';

import { Card } from '@instana/components';

export default function FailedRun() {
  return (
    <Card>
      <h1>Failed Run (Exception)</h1>
      <h3>Error Message</h3>
      <p>500 Internal Error for Get https://unsupported-dal10.console.cloud.ibm.com/healtcheck/v1/health</p>
      <h3>Stacktrace</h3>
    </Card>
  );
}
