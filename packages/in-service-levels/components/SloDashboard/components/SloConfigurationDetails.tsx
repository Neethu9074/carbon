/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Card, Ul } from '@instana/components';

import SloActionButtons from 'in-service-levels/components/SloDashboard/components/configuration/SloActionButtons';
import { SloTagsList } from 'in-service-levels/components/TagsList/SloTagsList';
import ScopeSection from 'in-service-levels/components/SloDashboard/components/configuration/ScopeSection';
import { SloTabData } from 'in-service-levels/components/SloDashboard/tabs';
import { Nullish } from 'in-types';

interface SloConfigurationDetailsProps {
  data?: SloTabData | Nullish;
}

export interface SloConfigurationDetailsContentProps {
  data: SloTabData;
}

export default function SloConfigurationDetails({ data }: SloConfigurationDetailsProps) {
  if (!data) {
    return null;
  }

  return <SloConfigurationDetailsContent data={data} />;
}

function SloConfigurationDetailsContent({ data }: SloConfigurationDetailsContentProps) {
  const { configuration } = data;

  return (
    <Card title={configuration.name} rightHeaderContent={<SloActionButtons configuration={configuration} />}>
      <SloTagsList tags={configuration.tags} />
      <Ul>
        <ScopeSection data={data} />
      </Ul>
    </Card>
  );
}
