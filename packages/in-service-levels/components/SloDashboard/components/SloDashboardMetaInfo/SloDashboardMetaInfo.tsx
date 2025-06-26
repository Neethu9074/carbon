/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { ServiceLevelObjectiveConfiguration } from '@instana/types';
import { Column, Grid } from '@instana/carbon';
import { TagSet } from '@instana/ibm-products';

import SloEntityInfo from 'in-service-levels/components/SloList/components/SloEntityInfo';
import { LabeledEntity } from 'in-service-levels/types';
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
      <Grid className={locals.gridContainer}>
        <Column sm={4} md={6} lg={9} xlg={7}>
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
        </Column>
        <Column sm={4} md={8} lg={7} xlg={9}>
          {showTag && (
            <TagSet
              overflowClassName={locals.tagSet}
              tags={tags.map(item => {
                return { label: item };
              })}
            />
          )}
        </Column>
      </Grid>
    </div>
  );
}
