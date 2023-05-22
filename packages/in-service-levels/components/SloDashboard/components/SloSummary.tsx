/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { SloTabData } from 'in-service-levels/components/SloDashboard/tabs';
import { Nullish } from 'in-types';

interface SloSummaryProps {
  data: SloTabData | Nullish;
}

export default function SloSummary({ data }: SloSummaryProps) {
  return <div>{data?.configuration.id}</div>;
}
