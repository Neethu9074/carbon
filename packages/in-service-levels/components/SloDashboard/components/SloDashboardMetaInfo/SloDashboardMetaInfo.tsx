/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { ServiceLevelObjectiveConfiguration } from '@instana/types';
import { Stack } from '@instana/components';

import SloEntityInfo from 'in-service-levels/components/SloList/components/SloEntityInfo';
import SloTagList from 'in-service-levels/components/TagsList/SloTagList';
import { LabeledEntity } from 'in-service-levels/types';

import locals from './SloDashboardMetaInfo.mless';

interface SloDashboardMetaInfoProps {
  configuration: ServiceLevelObjectiveConfiguration;
  entity?: LabeledEntity;
  service?: LabeledEntity;
}

export default function SloDashboardMetaInfo({ configuration, entity, service }: SloDashboardMetaInfoProps) {
  const { tags, entity: sloEntity } = configuration;
  return (
    <div className={locals.metaInfo}>
      <Stack direction="horizontal" align="center" distribution="start">
        {entity && <SloEntityInfo entity={entity} entityType={sloEntity.type} service={service} />}
        <SloTagList tags={tags} />
      </Stack>
    </div>
  );
}
