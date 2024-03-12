/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import useMediaQuery from '@mui/material/useMediaQuery';
import React from 'react';

import { ServiceLevelObjectiveConfiguration } from '@instana/types';
import { Stack } from '@instana/components';

import SloEntityInfo from 'in-service-levels/components/SloList/components/SloEntityInfo';
import { LabeledEntity } from 'in-service-levels/types';
import TagList from 'in-components/TagsList/TagList';

import locals from './SloDashboardMetaInfo.mless';

interface SloDashboardMetaInfoProps {
  configuration: ServiceLevelObjectiveConfiguration;
  entity?: LabeledEntity;
  service?: LabeledEntity;
  endpoint?: LabeledEntity;
}

export default function SloDashboardMetaInfo({ configuration, entity, service, endpoint }: SloDashboardMetaInfoProps) {
  const showTag = useMediaQuery('(min-width: 1200px)');

  const { tags, entity: sloEntity } = configuration;
  return (
    <div className={locals.metaInfo}>
      <Stack direction="horizontal" align="center" distribution="start">
        {entity && <SloEntityInfo entity={entity} entityType={sloEntity.type} service={service} endpoint={endpoint} />}
        {showTag && <TagList tags={tags} />}
      </Stack>
    </div>
  );
}
