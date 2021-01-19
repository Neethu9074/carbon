/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';

import { number } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';

// according to the PCF API, -1 is send on unknown. The PCF CLI will render it with ?, therefore we also do this
const questionMarkNumber = v => (v === -1 ? '?' : number.compact(v));

export default function InstanceMetric({ applicationId }) {
  return (
    <Fragment>
      <MetricValue snapshotId={applicationId} metric="runningInstances" formatter={questionMarkNumber} />/
      <MetricValue snapshotId={applicationId} metric="instances" formatter={number.compact} />
    </Fragment>
  );
}
