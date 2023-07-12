/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Card } from '@instana/components';

import { SloTabData } from 'in-service-levels/components/SloDashboard/tabs';
import { Nullish } from 'in-types';

interface SloConfigurationDetailsProps {
  data?: SloTabData | Nullish;
}

interface SloConfigurationDetailsContentProps {
  data: SloTabData;
}

export default function SloConfigurationDetails({ data }: SloConfigurationDetailsProps) {
  if (!data) {
    return null;
  }

  return <SloConfigurationDetailsContent data={data} />;
}

function SloConfigurationDetailsContent({ data }: SloConfigurationDetailsContentProps) {
  return (
    <Card title={data.configuration.name}>
      <></>
    </Card>
  );
}
