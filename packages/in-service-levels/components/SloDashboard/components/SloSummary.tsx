/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { ServiceLevelObjectiveConfiguration } from '@instana/types';

import { Nullish } from 'in-types';

interface SloSummaryProps {
  data: ServiceLevelObjectiveConfiguration | Nullish;
}

export default function SloSummary({ data }: SloSummaryProps) {
  return <div>{data?.id}</div>;
}
