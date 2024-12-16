/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { ServiceLevelObjectiveConfiguration } from '@instana/types';
import { Stack } from '@instana/components';

import SloEntityInfo from 'in-service-levels/components/SloList/components/SloEntityInfo';
import { LabeledEntity } from 'in-service-levels/types';
import TagList from 'in-components/TagsList/TagList';
import useMediaQuery from 'in-hooks/useMediaQuery';

import locals from './SloDashboardMetaInfo.mless';

interface SloDashboardMetaInfoProps {
  configuration: ServiceLevelObjectiveConfiguration;
  entities?: LabeledEntity[];
  service?: LabeledEntity;
  endpoint?: LabeledEntity;
}

export default function SloDashboardMetaInfo({
  configuration,
  entities,
  service,
  endpoint
}: SloDashboardMetaInfoProps) {
  const showTag = useMediaQuery('(min-width: 1200px)');

  const { tags, entity: sloEntity } = configuration;

  return (
    <div className={locals.metaInfo}>
      <Stack direction="horizontal" align="center" distribution="start">
        {entities && (
          <SloEntityInfo
            entities={entities}
            entityType={sloEntity.type}
            service={service}
            endpoint={endpoint}
            sloEntity={sloEntity}
            metaInfo
          />
        )}
        {showTag && <TagList tags={tags} />}
      </Stack>
    </div>
  );
}
