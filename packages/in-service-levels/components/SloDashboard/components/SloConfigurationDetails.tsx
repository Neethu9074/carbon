/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Card, Ul } from '@instana/components';

import ScopeSection from 'in-service-levels/components/SloDashboard/components/configuration/ScopeSection/ScopeSection';
import ObjectiveSection from 'in-service-levels/components/SloDashboard/components/configuration/ObjectiveSection';
import IndicatorSection from 'in-service-levels/components/SloDashboard/components/configuration/IndicatorSection';
import SloActionButtons from 'in-service-levels/components/SloDashboard/components/configuration/SloActionButtons';
import EntitySection from 'in-service-levels/components/SloDashboard/components/configuration/EntitySection';
import { SloTabData } from 'in-service-levels/components/SloDashboard/tabs';
import TagList from 'in-components/TagsList/TagList';
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
  const { configuration, entity } = data;

  return (
    <Card
      leftHeaderContent={<TagList tags={configuration.tags} />}
      rightHeaderContent={<SloActionButtons configuration={configuration} entity={entity} />}
    >
      <Ul space="medium">
        <EntitySection data={data} />
        <ScopeSection data={data} />
        <IndicatorSection data={data} />
        <ObjectiveSection data={data} />
      </Ul>
    </Card>
  );
}
